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
});

describe('repository.tasks', () => {
  beforeEach(async () => {
    await db.categories.clear();
    await db.tasks.clear();
    await db.subtasks.clear();
  });

  it('should create task with default Q4 quadrant', async () => {
    const cat = await repository.categories.create('Test Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Default Task');
    
    expect(task.eisenhower).toBe('Q4');
    const saved = await db.tasks.get(task.id);
    expect(saved?.eisenhower).toBe('Q4');
  });
});

describe('repository.subtasks', () => {
  beforeEach(async () => {
    await db.categories.clear();
    await db.tasks.clear();
    await db.subtasks.clear();
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
});
