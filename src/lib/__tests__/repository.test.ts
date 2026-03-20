import { describe, it, expect, beforeEach } from 'vitest';
import { repository, subtaskComparator } from '../repository';
import { db } from '../db';

describe('repository.categories', () => {
  beforeEach(async () => {
    await db.categories.clear();
    await db.tasks.clear();
    await db.dailyPlanItems.clear();
    await db.subtasks.clear();
  });

  it('should update category name and color', async () => {
    const cat = await repository.categories.create('Initial Name', '#000');
    await repository.categories.update(cat.id, { name: 'Updated Name', color: '#fff' });
    
    const updated = await db.categories.get(cat.id);
    expect(updated?.name).toBe('Updated Name');
    expect(updated?.color).toBe('#fff');
    expect(new Date(updated?.updatedAt || '').getTime()).toBeGreaterThanOrEqual(new Date(cat.updatedAt).getTime());
  });

  it('should soft delete category and archive tasks', async () => {
    const cat = await repository.categories.create('Cat to Delete', '#000');
    const task = await repository.tasks.create(cat.id, 'Task in Cat');
    
    await repository.categories.delete(cat.id);
    
    const deletedCat = await db.categories.get(cat.id);
    expect(deletedCat?.isArchived).toBe(true);
    
    const archivedTask = await db.tasks.get(task.id);
    expect(archivedTask?.status).toBe('ARCHIVED');
  });

  it('should update categories orderIndex', async () => {
    const cat1 = await repository.categories.create('Cat 1', '#000');
    const cat2 = await repository.categories.create('Cat 2', '#fff');
    
    // cat1 orderIndex should be 0, cat2 should be 1 (based on current implementation)
    expect(cat1.orderIndex).toBe(0);
    expect(cat2.orderIndex).toBe(1);

    // Swap them
    await repository.categories.updateOrder([cat2.id, cat1.id]);

    const updated1 = await db.categories.get(cat1.id);
    const updated2 = await db.categories.get(cat2.id);

    expect(updated1?.orderIndex).toBe(1);
    expect(updated2?.orderIndex).toBe(0);

    const all = await repository.categories.getAll();
    expect(all[0].id).toBe(cat2.id);
    expect(all[1].id).toBe(cat1.id);
  });
});

describe('repository.tasks', () => {
  beforeEach(async () => {
    await db.categories.clear();
    await db.tasks.clear();
    await db.subtasks.clear();
    await db.dailyPlanItems.clear();
  });

  it('should create task with default Q4 quadrant', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Default Task');
    
    expect(task.eisenhower).toBe('Q4');
    const saved = await db.tasks.get(task.id);
    expect(saved?.eisenhower).toBe('Q4');
  });

  it('should cascade delete subtasks and daily plan items when task is deleted', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Task to Delete');
    const subtask1 = await repository.subtasks.create(task.id, 'Subtask 1');
    const subtask2 = await repository.subtasks.create(task.id, 'Subtask 2');

    // Add task and subtask1 to daily plan
    await db.dailyPlanItems.add({
      id: crypto.randomUUID(),
      date: '2026-02-11',
      refId: task.id,
      refType: 'TASK',
      orderIndex: 0,
      isRollover: false,
      isCompleted: false,
      updatedAt: new Date().toISOString()
    });
    await db.dailyPlanItems.add({
      id: crypto.randomUUID(),
      date: '2026-02-11',
      refId: subtask1.id,
      refType: 'SUBTASK',
      orderIndex: 1,
      isRollover: false,
      isCompleted: false,
      updatedAt: new Date().toISOString()
    });

    await repository.tasks.delete(task.id);

    // Verify Task deleted
    const deletedTask = await db.tasks.get(task.id);
    expect(deletedTask).toBeUndefined();

    // Verify Subtasks deleted
    const deletedSubtask1 = await db.subtasks.get(subtask1.id);
    const deletedSubtask2 = await db.subtasks.get(subtask2.id);
    expect(deletedSubtask1).toBeUndefined();
    expect(deletedSubtask2).toBeUndefined();

    // Verify Daily Plan items deleted
    const dailyPlanItems = await db.dailyPlanItems.toArray();
    expect(dailyPlanItems).toHaveLength(0);
  });
});

describe('repository.subtasks', () => {
  beforeEach(async () => {
    await db.categories.clear();
    await db.tasks.clear();
    await db.subtasks.clear();
    await db.dailyPlanItems.clear();
  });

  it('should inherit quadrant from parent task', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    // Create task with Q2
    const task = await repository.tasks.create(cat.id, 'Q2 Task');
    await repository.tasks.update(task.id, { eisenhower: 'Q2' });
    
    const subtask = await repository.subtasks.create(task.id, 'Inherited Subtask');
    expect(subtask.eisenhower).toBe('Q2');
    
    const saved = await db.subtasks.get(subtask.id);
    expect(saved?.eisenhower).toBe('Q2');
  });

  it('should fallback to Q4 if parent task is missing', async () => {
    const subtask = await repository.subtasks.create('non-existent-id', 'Fallback Subtask');
    expect(subtask.eisenhower).toBe('Q4');
  });

  it('should cascade delete daily plan items when subtask is deleted', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Parent Task');
    const subtask = await repository.subtasks.create(task.id, 'Subtask to Delete');

    await db.dailyPlanItems.add({
      id: crypto.randomUUID(),
      date: '2026-02-11',
      refId: subtask.id,
      refType: 'SUBTASK',
      orderIndex: 0,
      isRollover: false,
      isCompleted: false,
      updatedAt: new Date().toISOString()
    });

    await repository.subtasks.delete(subtask.id);

    // Verify Subtask deleted
    const deletedSubtask = await db.subtasks.get(subtask.id);
    expect(deletedSubtask).toBeUndefined();

    // Verify Daily Plan item deleted
    const dailyPlanItems = await db.dailyPlanItems.toArray();
    expect(dailyPlanItems).toHaveLength(0);
  });

  it('should auto-complete parent task when all subtasks are done', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Parent Task');
    const sub1 = await repository.subtasks.create(task.id, 'Sub 1');
    const sub2 = await repository.subtasks.create(task.id, 'Sub 2');

    await repository.subtasks.update(sub1.id, { isCompleted: true });
    let updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('TODO');

    await repository.subtasks.update(sub2.id, { isCompleted: true });
    updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('DONE');
  });

  it('should revert parent task to TODO when a new incomplete subtask is added to a DONE task', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Parent Task');
    const sub1 = await repository.subtasks.create(task.id, 'Sub 1');
    await repository.subtasks.update(sub1.id, { isCompleted: true });

    let updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('DONE');

    // T004: Adding a new subtask (default incomplete) should revert task to TODO
    await repository.subtasks.create(task.id, 'Sub 2');
    updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('TODO');
  });

  it('should ALLOW manually setting task to DONE even if it has incomplete subtasks (US2)', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Parent Task');
    await repository.subtasks.create(task.id, 'Incomplete Sub');

    // US2: Manual override should be allowed
    await repository.tasks.update(task.id, { status: 'DONE' });
    const updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('DONE');
  });

  it('should auto-complete parent task if the only incomplete subtask is deleted', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Parent Task');
    const sub1 = await repository.subtasks.create(task.id, 'Sub 1');
    const sub2 = await repository.subtasks.create(task.id, 'Sub 2');

    await repository.subtasks.update(sub1.id, { isCompleted: true });
    let updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('TODO');

    // T008: Delete the only incomplete subtask (sub2)
    await repository.subtasks.delete(sub2.id);
    updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('DONE');
  });

  it('should NOT auto-complete parent task if it contains a daily subtask (FR-005)', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Task with Daily');
    const sub1 = await repository.subtasks.create(task.id, 'One-time Done', 'one-time');
    await repository.subtasks.create(task.id, 'Daily Item', 'daily');

    await repository.subtasks.update(sub1.id, { isCompleted: true });
    
    // Even if one-time is done, daily exists, so status should stay TODO
    const updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('TODO');
  });

  it('should auto-complete parent task if a daily subtask is manually marked as done (Clarification 2026-02-13)', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Task with Daily');
    const sub1 = await repository.subtasks.create(task.id, 'One-time Done', 'one-time');
    const daily = await repository.subtasks.create(task.id, 'Daily Item', 'daily');

    await repository.subtasks.update(sub1.id, { isCompleted: true });
    let updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('TODO'); // Still TODO because daily is incomplete

    // Manually mark daily subtask definition as done
    await repository.subtasks.update(daily.id, { isCompleted: true });
    updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('DONE'); // Now DONE because daily is manually completed
  });

  it('should auto-complete parent task if a multi-time subtask is manually marked as done (Clarification 2026-02-13)', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Task with Multi');
    const multi = await repository.subtasks.create(task.id, 'Multi Item', 'multi-time', 10);

    let updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('TODO');

    // Manually mark multi-time subtask definition as done (even with 0 progress)
    await repository.subtasks.update(multi.id, { isCompleted: true });
    updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('DONE');
  });

  it('should sync only one-time subtasks when task is manually set to DONE (FR-006)', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Manual Sync Task');
    const oneTime = await repository.subtasks.create(task.id, 'One-time', 'one-time');
    const multiTime = await repository.subtasks.create(task.id, 'Multi-time', 'multi-time', 3);
    const daily = await repository.subtasks.create(task.id, 'Daily', 'daily');

    // Manually update task status to DONE
    await repository.tasks.update(task.id, { status: 'DONE' });

    const updatedOneTime = await db.subtasks.get(oneTime.id);
    const updatedMultiTime = await db.subtasks.get(multiTime.id);
    const updatedDaily = await db.subtasks.get(daily.id);

    expect(updatedOneTime?.isCompleted).toBe(true);
    expect(updatedMultiTime?.isCompleted).toBe(false); // Should NOT change
    expect(updatedDaily?.isCompleted).toBe(false);     // Should NOT change
    
    const updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('DONE');
  });
});

describe('repository.dailyPlan (Recurring)', () => {
  beforeEach(async () => {
    await db.categories.clear();
    await db.tasks.clear();
    await db.subtasks.clear();
    await db.dailyPlanItems.clear();
  });

  it('should sync one-time subtask completion with subtask definition', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Parent Task');
    const sub = await repository.subtasks.create(task.id, 'One-time Sub', 'one-time');
    
    const planItem = await repository.dailyPlan.add('2026-02-12', sub.id, 'SUBTASK', 0);
    expect(planItem.isCompleted).toBe(false);

    await repository.dailyPlan.toggleCompletion(planItem.id, true);
    
    const updatedPlanItem = await db.dailyPlanItems.get(planItem.id);
    expect(updatedPlanItem?.isCompleted).toBe(true);

    const updatedSub = await db.subtasks.get(sub.id);
    expect(updatedSub?.isCompleted).toBe(true);

    const updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('DONE');
  });

  it('should decouple multi-time subtask completion from subtask definition until limit reached', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Parent Task');
    const sub = await repository.subtasks.create(task.id, 'Multi-time Sub', 'multi-time', 2);
    
    const day1Item = await repository.dailyPlan.add('2026-02-12', sub.id, 'SUBTASK', 0);
    const day2Item = await repository.dailyPlan.add('2026-02-13', sub.id, 'SUBTASK', 0);

    // Complete only one day
    await repository.dailyPlan.toggleCompletion(day1Item.id, true);
    
    const updatedSub = await db.subtasks.get(sub.id);
    expect(updatedSub?.isCompleted).toBe(false); // Not yet reached limit (2)

    // Complete second day
    await repository.dailyPlan.toggleCompletion(day2Item.id, true);
    
    const fullyUpdatedSub = await db.subtasks.get(sub.id);
    expect(fullyUpdatedSub?.isCompleted).toBe(true); // Limit reached

    const updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('DONE');
  });

  it('should handle daily subtask as decoupled instances without overall completion limit', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Parent Task');
    const sub = await repository.subtasks.create(task.id, 'Daily Sub', 'daily');
    
    const day1Item = await repository.dailyPlan.add('2026-02-12', sub.id, 'SUBTASK', 0);
    await repository.dailyPlan.add('2026-02-13', sub.id, 'SUBTASK', 0);

    await repository.dailyPlan.toggleCompletion(day1Item.id, true);
    
    const updatedSub = await db.subtasks.get(sub.id);
    expect(updatedSub?.isCompleted).toBe(false); // Daily never marks definition as completed automatically

    const updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('TODO');
  });

  it('should clear repeatLimit when switching to one-time type', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Parent Task');
    const sub = await repository.subtasks.create(task.id, 'Temp Sub', 'multi-time', 5);
    
    expect(sub.repeatLimit).toBe(5);

    await repository.subtasks.update(sub.id, { type: 'one-time' });
    
    const updatedSub = await db.subtasks.get(sub.id);
    expect(updatedSub?.type).toBe('one-time');
    expect(updatedSub?.repeatLimit).toBeUndefined();
  });

  describe('quickCreate', () => {
    it('should use provided taskId if available', async () => {
      const cat = await repository.categories.create('Cat', '#000');
      const task = await repository.tasks.create(cat.id, 'Task');
      const sub = await repository.subtasks.quickCreate('New Sub', '2026-03-19', 'one-time', task.id);
      
      expect(sub.taskId).toBe(task.id);
      expect(sub.title).toBe('New Sub');
      
      const planItems = await repository.dailyPlan.getByDate('2026-03-19');
      expect(planItems.some(i => i.refId === sub.id)).toBe(true);
    });

    it('should fallback to most recent task if taskId is missing', async () => {
      const cat = await repository.categories.create('Cat', '#000');
      const task1 = await repository.tasks.create(cat.id, 'Old Task');
      const task2 = await repository.tasks.create(cat.id, 'New Task');
      
      // Manually adjust timestamps to ensure task2 is newer
      await db.tasks.update(task1.id, { createdAt: '2026-03-19T10:00:00Z' });
      await db.tasks.update(task2.id, { createdAt: '2026-03-19T11:00:00Z' });

      const sub = await repository.subtasks.quickCreate('Auto Sub', '2026-03-19');
      expect(sub.taskId).toBe(task2.id);
    });

    it('should create default Category and Task if none exist', async () => {
      // Database is cleared in beforeEach
      const sub = await repository.subtasks.quickCreate('First Ever Sub', '2026-03-19');
      
      const cats = await db.categories.toArray();
      expect(cats).toHaveLength(1);
      expect(cats[0].name).toBe('一般');
      
      const tasks = await db.tasks.toArray();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('日常任務');
      expect(tasks[0].categoryId).toBe(cats[0].id);
      
      expect(sub.taskId).toBe(tasks[0].id);
    });
  });

  describe('dailyPlan actions', () => {
    it('should move item to new date and append to end', async () => {
      const item = await repository.dailyPlan.add('2026-03-19', 'r1', 'TASK', 0);
      await repository.dailyPlan.add('2026-03-20', 'r2', 'TASK', 500);
      
      await repository.dailyPlan.moveItemToDate(item.id, '2026-03-20');
      
      const moved = await db.dailyPlanItems.get(item.id);
      expect(moved?.date).toBe('2026-03-20');
      expect(moved?.orderIndex).toBeGreaterThan(500);
    });

    it('should bulk update order', async () => {
      const i1 = await repository.dailyPlan.add('2026-03-19', 'r1', 'TASK', 0);
      const i2 = await repository.dailyPlan.add('2026-03-19', 'r2', 'TASK', 1000);
      
      await repository.dailyPlan.bulkUpdateOrder([i2.id, i1.id]);
      
      const all = await repository.dailyPlan.getByDate('2026-03-19');
      expect(all[0].id).toBe(i2.id);
      expect(all[1].id).toBe(i1.id);
    });
  });

  describe('archival logic', () => {
    it('should archive and unarchive subtasks', async () => {
      const cat = await repository.categories.create('Cat', '#000');
      const task = await repository.tasks.create(cat.id, 'Task');
      const sub = await repository.subtasks.create(task.id, 'Sub');
      
      expect(sub.isArchived).toBe(false);

      await repository.subtasks.update(sub.id, { isArchived: true });
      const archived = await db.subtasks.get(sub.id);
      expect(archived?.isArchived).toBe(true);

      await repository.subtasks.update(sub.id, { isArchived: false });
      const restored = await db.subtasks.get(sub.id);
      expect(restored?.isArchived).toBe(false);
    });
  });
});

describe('subtaskComparator', () => {
  const baseSub = {
    id: 'id1',
    taskId: 'task1',
    title: 'Sub 1',
    isCompleted: false,
    type: 'one-time' as const,
    eisenhower: 'Q4' as const,
    createdAt: '2026-03-19T10:00:00Z',
    updatedAt: '2026-03-19T10:00:00Z',
    isArchived: false
  };

  it('should sort by createdAt ascending', () => {
    const s1 = { ...baseSub, id: 'a', createdAt: '2026-03-19T10:00:00Z' };
    const s2 = { ...baseSub, id: 'b', createdAt: '2026-03-19T11:00:00Z' };
    
    expect(subtaskComparator(s1, s2)).toBeLessThan(0);
    expect(subtaskComparator(s2, s1)).toBeGreaterThan(0);
  });

  it('should fallback to updatedAt if createdAt is missing', () => {
    const s1 = { ...baseSub, id: 'a', createdAt: '', updatedAt: '2026-03-19T10:00:00Z' };
    const s2 = { ...baseSub, id: 'b', createdAt: '', updatedAt: '2026-03-19T11:00:00Z' };
    
    expect(subtaskComparator(s1, s2)).toBeLessThan(0);
  });

  it('should use id as tie-breaker if times are equal', () => {
    const s1 = { ...baseSub, id: 'a', createdAt: '2026-03-19T10:00:00Z' };
    const s2 = { ...baseSub, id: 'b', createdAt: '2026-03-19T10:00:00Z' };
    
    expect(subtaskComparator(s1, s2)).toBeLessThan(0);
    expect(subtaskComparator(s2, s1)).toBeGreaterThan(0);
  });
});
