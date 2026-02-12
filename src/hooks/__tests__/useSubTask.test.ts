import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useSubTask } from '../useSubTask';
import { db } from '@/lib/db';
import { repository } from '@/lib/repository';

describe('useSubTask', () => {
  beforeEach(async () => {
    await db.categories.clear();
    await db.tasks.clear();
    await db.subtasks.clear();
  });

  it('should fetch subtasks for a task', async () => {
    const cat = await repository.categories.create('Test', '#000');
    const task = await repository.tasks.create(cat.id, 'Task');
    await repository.subtasks.create(task.id, 'Sub 1');

    const { result } = renderHook(() => useSubTask(task.id));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.subtasks).toHaveLength(1);
    expect(result.current.subtasks[0].title).toBe('Sub 1');
  });

  it('should update parent task status via repository when updating subtask', async () => {
    const cat = await repository.categories.create('Test', '#000');
    const task = await repository.tasks.create(cat.id, 'Task');
    const sub = await repository.subtasks.create(task.id, 'Sub 1');

    const { result } = renderHook(() => useSubTask(task.id));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateSubTask(sub.id, { isCompleted: true });
    });

    const updatedTask = await db.tasks.get(task.id);
    expect(updatedTask?.status).toBe('DONE');
  });
});
