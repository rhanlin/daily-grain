import { db, type Category, type Task, type SubTask, type DailyPlanItem, type SubTaskType } from './db';
import { v4 as uuidv4 } from 'uuid';

export const repository = {
  categories: {
    async getAll() {
      return await db.categories.filter(c => !c.isArchived).sortBy('orderIndex');
    },
    async create(name: string, color: string) {
      const now = new Date().toISOString();
      const count = await db.categories.count();
      const category: Category = {
        id: uuidv4(),
        name,
        color,
        createdAt: now,
        updatedAt: now,
        isArchived: false,
        orderIndex: count
      };
      await db.categories.add(category);
      return category;
    },
    async update(id: string, updates: Partial<Category>) {
      const updatedAt = new Date().toISOString();
      await db.categories.update(id, { ...updates, updatedAt });
    },
    async updateOrder(ids: string[]) {
      const updatedAt = new Date().toISOString();
      await db.transaction('rw', db.categories, async () => {
        for (let i = 0; i < ids.length; i++) {
          await db.categories.update(ids[i], { orderIndex: i, updatedAt });
        }
      });
    },
    async delete(id: string) {
      // Soft delete category
      await db.categories.update(id, { isArchived: true, updatedAt: new Date().toISOString() });
      // Soft delete all tasks in this category (Cascade Archive)
      const tasks = await db.tasks.where('categoryId').equals(id).toArray();
      for (const task of tasks) {
        await db.tasks.update(task.id, { status: 'ARCHIVED', updatedAt: new Date().toISOString() });
        // We do NOT delete subtasks for soft-deleted tasks.
        
        // Remove from Daily Plan to keep plan clean?
        // If task is archived, it shouldn't appear in plan.
        await db.dailyPlanItems.where('refId').equals(task.id).delete();
        
        // Also remove subtasks from daily plan
        const subtasks = await db.subtasks.where('taskId').equals(task.id).toArray();
        for (const sub of subtasks) {
            await db.dailyPlanItems.where('refId').equals(sub.id).delete();
        }
      }
    }
  },
  tasks: {
    async getByCategory(categoryId: string) {
      return await db.tasks.where('categoryId').equals(categoryId).toArray();
    },
    async create(categoryId: string, title: string, description: string = '') {
      const now = new Date().toISOString();
      const task: Task = {
        id: uuidv4(),
        categoryId,
        title,
        description,
        status: 'TODO',
        eisenhower: 'Q4',
        createdAt: now,
        updatedAt: now
      };
      await db.tasks.add(task);
      return task;
    },
    async update(id: string, updates: Partial<Task>) {
      const updatedAt = new Date().toISOString();
      
      // FR-006: Manual DONE Sync
      if (updates.status === 'DONE') {
        await db.transaction('rw', db.subtasks, async () => {
          const subtasks = await db.subtasks.where('taskId').equals(id).toArray();
          const oneTimeIds = subtasks
            .filter(s => s.type === 'one-time')
            .map(s => s.id);
          
          if (oneTimeIds.length > 0) {
            await db.subtasks.bulkUpdate(oneTimeIds.map(sid => ({
              key: sid,
              changes: { isCompleted: true, updatedAt }
            })));
          }
          // Note: multi-time and daily subtasks are NOT modified to preserve history.
        });
        
        if (!updates.completedAt) {
          updates.completedAt = updatedAt;
        }
      }

      await db.tasks.update(id, { ...updates, updatedAt });
    },
    async delete(id: string) {
      await db.transaction('rw', db.tasks, db.subtasks, db.dailyPlanItems, async () => {
        // Hard Delete Subtasks (Cascade)
        const subtasks = await db.subtasks.where('taskId').equals(id).toArray();
        const subtaskIds = subtasks.map(s => s.id);
        
        await db.subtasks.bulkDelete(subtaskIds);
        
        // Remove Subtasks from Daily Plans
        if (subtaskIds.length > 0) {
            await db.dailyPlanItems.where('refId').anyOf(subtaskIds).delete();
        }

        // Remove Task from Daily Plans
        await db.dailyPlanItems.where('refId').equals(id).delete();
        
        // Hard Delete Task
        await db.tasks.delete(id);
      });
    }
  },
  subtasks: {
    async syncParentTaskStatus(taskId: string) {
      const updatedAt = new Date().toISOString();
      const allSubs = await db.subtasks.where('taskId').equals(taskId).toArray();
      
      // FR-005: If a Task has zero subtasks, auto-completion MUST NOT trigger
      if (allSubs.length === 0) return;

      // FR-004 & FR-005: Only INCOMPLETE Daily SubTasks disable auto-completion.
      const hasIncompleteDaily = allSubs.some(s => s.type === 'daily' && !s.isCompleted);
      
      // FR-003: Multi-time SubTask logic
      // Considered "done" if isCompleted is manually true OR completedCount >= repeatLimit
      const evalSubTaskDone = async (s: SubTask) => {
        if (s.isCompleted) return true; // Manual override (Applies to all types including Daily/Multi-time)
        
        if (s.type === 'one-time') return s.isCompleted;
        if (s.type === 'multi-time') {
          const completedCount = await db.dailyPlanItems
            .where('refId').equals(s.id)
            .filter(i => i.isCompleted)
            .count();
          return s.repeatLimit ? completedCount >= s.repeatLimit : true;
        }
        return false; // Incomplete Daily is never "done" for the sake of auto-parent-completion
      };

      const results = await Promise.all(allSubs.map(evalSubTaskDone));
      const allDone = results.every(r => r === true);
      const parentTask = await db.tasks.get(taskId);

      if (!parentTask || parentTask.status === 'ARCHIVED') return;

      // Logic: Only auto-complete if NO incomplete daily exists AND ALL others are done.
      if (!hasIncompleteDaily && allDone) {
        await db.tasks.update(taskId, { 
          status: 'DONE', 
          updatedAt,
          completedAt: updatedAt 
        });
      } else {
        // FR-007: Dynamic Reversion - If any subtask is unchecked or added, revert to TODO
        if (parentTask.status === 'DONE') {
            await db.tasks.update(taskId, { 
                status: 'TODO', 
                updatedAt,
                completedAt: undefined 
            });
        }
      }
    },
    async getByTask(taskId: string) {
      return await db.subtasks.where('taskId').equals(taskId).toArray();
    },
    async create(taskId: string, title: string, type: SubTaskType = 'one-time', repeatLimit?: number) {
      const now = new Date().toISOString();
      
      // Fetch parent task to inherit Eisenhower value
      const parentTask = await db.tasks.get(taskId);
      const inheritedEisenhower = parentTask?.eisenhower || 'Q4';

      const subtask: SubTask = {
        id: uuidv4(),
        taskId,
        title,
        isCompleted: false,
        type,
        repeatLimit,
        eisenhower: inheritedEisenhower,
        createdAt: now,
        updatedAt: now
      };
      await db.subtasks.add(subtask);
      await this.syncParentTaskStatus(taskId);
      return subtask;
    },
    async update(id: string, updates: Partial<SubTask>) {
      const updatedAt = new Date().toISOString();
      
      // T006.1: Handle type-switching edge cases
      if (updates.type === 'one-time') {
        updates.repeatLimit = undefined;
      }

      await db.subtasks.update(id, { ...updates, updatedAt });

      // Auto-complete parent task
      const subtask = await db.subtasks.get(id);
      if (subtask) {
        await this.syncParentTaskStatus(subtask.taskId);
      }
    },
    async delete(id: string) {
      const subtask = await db.subtasks.get(id);
      if (!subtask) return;

      await db.transaction('rw', db.tasks, db.subtasks, db.dailyPlanItems, async () => {
        await db.subtasks.delete(id);
        // Remove from Daily Plan
        await db.dailyPlanItems.where('refId').equals(id).delete();
        
        // Sync parent status
        await this.syncParentTaskStatus(subtask.taskId);
      });
    }
  },
  utils: {
    cycleEisenhower(current: 'Q1' | 'Q2' | 'Q3' | 'Q4'): 'Q1' | 'Q2' | 'Q3' | 'Q4' {
      const map: Record<string, 'Q1' | 'Q2' | 'Q3' | 'Q4'> = {
        'Q1': 'Q2',
        'Q2': 'Q3',
        'Q3': 'Q4',
        'Q4': 'Q1'
      };
      return map[current];
    }
  },
  dailyPlan: {
    async getByDate(date: string) {
      if (!date) return [];
      return await db.dailyPlanItems.where('date').equals(date).sortBy('orderIndex');
    },
    async add(date: string, refId: string, refType: 'TASK' | 'SUBTASK', orderIndex: number) {
      const now = new Date().toISOString();
      const item: DailyPlanItem = {
        id: uuidv4(),
        date,
        refId,
        refType,
        orderIndex,
        isRollover: false,
        isCompleted: false, // T005: Initialize as false
        updatedAt: now
      };
      await db.dailyPlanItems.add(item);
      return item;
    },
    async updateOrder(id: string, orderIndex: number) {
      const updatedAt = new Date().toISOString();
      await db.dailyPlanItems.update(id, { orderIndex, updatedAt });
    },
    // T006: Handle decoupling logic for multi-time/daily tasks
    async toggleCompletion(itemId: string, isCompleted: boolean) {
      const updatedAt = new Date().toISOString();
      
      await db.transaction('rw', db.tasks, db.subtasks, db.dailyPlanItems, async () => {
        const item = await db.dailyPlanItems.get(itemId);
        if (!item) return;

        // Update DailyPlanItem status
        await db.dailyPlanItems.update(itemId, { isCompleted, updatedAt });

        // If it's a subtask, check if we need to sync with SubTask definition
        if (item.refType === 'SUBTASK') {
          const subtask = await db.subtasks.get(item.refId);
          if (subtask) {
            if (subtask.type === 'one-time') {
              // One-time: Sync with SubTask definition
              await db.subtasks.update(subtask.id, { isCompleted, updatedAt });
            } else if (subtask.type === 'multi-time') {
              // Multi-time: Check if all instances are done to mark SubTask definition as completed
              const completedCount = await db.dailyPlanItems
                .where('refId').equals(subtask.id)
                .filter(i => i.isCompleted)
                .count();
              
              const isFullyDone = subtask.repeatLimit ? completedCount >= subtask.repeatLimit : true;
              await db.subtasks.update(subtask.id, { isCompleted: isFullyDone, updatedAt });
            }
            // All types (including daily) should trigger sync to handle dynamic reversion (FR-007)
            await repository.subtasks.syncParentTaskStatus(subtask.taskId);
          }
        } else if (item.refType === 'TASK') {
            // Task: Sync with Task definition status
            await db.tasks.update(item.refId, { 
                status: isCompleted ? 'DONE' : 'TODO', 
                updatedAt,
                completedAt: isCompleted ? updatedAt : undefined
            });
        }
      });
    }
  }
};
