import { db, type Category, type Task, type SubTask, type DailyPlanItem } from './db';
import { v4 as uuidv4 } from 'uuid';

export const repository = {
  categories: {
    async getAll() {
      return await db.categories.filter(c => !c.isArchived).toArray();
    },
    async create(name: string, color: string) {
      const now = new Date().toISOString();
      const category: Category = {
        id: uuidv4(),
        name,
        color,
        createdAt: now,
        updatedAt: now,
        isArchived: false
      };
      await db.categories.add(category);
      return category;
    },
    async update(id: string, updates: Partial<Category>) {
      const updatedAt = new Date().toISOString();
      await db.categories.update(id, { ...updates, updatedAt });
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
        updatedAt: now
      };
      await db.tasks.add(task);
      return task;
    },
    async update(id: string, updates: Partial<Task>) {
      const updatedAt = new Date().toISOString();
      await db.tasks.update(id, { ...updates, updatedAt });
      
      // Auto-complete check logic could be triggered here or via a dedicated hook
    },
    async delete(id: string) {
      await db.tasks.delete(id);
      // Also delete associated subtasks
      await db.subtasks.where('taskId').equals(id).delete();
    }
  },
  subtasks: {
    async getByTask(taskId: string) {
      return await db.subtasks.where('taskId').equals(taskId).toArray();
    },
    async create(taskId: string, title: string) {
      const now = new Date().toISOString();
      const subtask: SubTask = {
        id: uuidv4(),
        taskId,
        title,
        isCompleted: false,
        updatedAt: now
      };
      await db.subtasks.add(subtask);
      return subtask;
    },
    async update(id: string, updates: Partial<SubTask>) {
      const updatedAt = new Date().toISOString();
      await db.subtasks.update(id, { ...updates, updatedAt });

      // Auto-complete parent task
      const subtask = await db.subtasks.get(id);
      if (subtask) {
        const taskId = subtask.taskId;
        const allSubs = await db.subtasks.where('taskId').equals(taskId).toArray();
        const allDone = allSubs.every(s => s.isCompleted);
        if (allDone && allSubs.length > 0) {
          await db.tasks.update(taskId, { 
            status: 'DONE', 
            updatedAt,
            completedAt: updatedAt 
          });
        } else {
          await db.tasks.update(taskId, { 
            status: 'TODO', 
            updatedAt,
            completedAt: undefined 
          });
        }
      }
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
        updatedAt: now
      };
      await db.dailyPlanItems.add(item);
      return item;
    },
    async updateOrder(id: string, orderIndex: number) {
      const updatedAt = new Date().toISOString();
      await db.dailyPlanItems.update(id, { orderIndex, updatedAt });
    }
  }
};
