import { db } from '@/lib/db';
import { repository } from '@/lib/repository';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Repository Auto-Completion Logic', () => {
  beforeEach(async () => {
    await db.tasks.clear();
    await db.subtasks.clear();
    await db.categories.clear();
  });

  it('should mark parent task as DONE when all subtasks are completed', async () => {
    const cat = await repository.categories.create('Work', 'blue');
    const task = await repository.tasks.create(cat.id, 'Main Task');
    
    const sub1 = await repository.subtasks.create(task.id, 'Sub 1');
    const sub2 = await repository.subtasks.create(task.id, 'Sub 2');

    await repository.subtasks.update(sub1.id, { isCompleted: true });
    let updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('TODO');

    await repository.subtasks.update(sub2.id, { isCompleted: true });
    updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('DONE');
  });

  it('should mark parent task as TODO if a subtask is unchecked', async () => {
    const cat = await repository.categories.create('Work', 'blue');
    const task = await repository.tasks.create(cat.id, 'Main Task');
    
    const sub1 = await repository.subtasks.create(task.id, 'Sub 1');
    await repository.subtasks.update(sub1.id, { isCompleted: true });
    
    let updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('DONE');

    await repository.subtasks.update(sub1.id, { isCompleted: false });
    updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('TODO');
  });
});