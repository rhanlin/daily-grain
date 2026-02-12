import { describe, it, expect, beforeEach } from 'vitest';
import { repository } from '../repository';
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

  it('should prevent manually setting task to DONE if it has incomplete subtasks', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Parent Task');
    await repository.subtasks.create(task.id, 'Incomplete Sub');

    // T005: Try to manually set task to DONE
    await repository.tasks.update(task.id, { status: 'DONE' });
    const updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('TODO');
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
});
