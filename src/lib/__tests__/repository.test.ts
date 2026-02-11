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
      updatedAt: new Date().toISOString()
    });
    await db.dailyPlanItems.add({
      id: crypto.randomUUID(),
      date: '2026-02-11',
      refId: subtask1.id,
      refType: 'SUBTASK',
      orderIndex: 1,
      isRollover: false,
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
});