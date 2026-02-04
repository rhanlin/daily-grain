import { renderHook, waitFor } from '@testing-library/react';
import { useTask } from '../useTask';
import { db } from '@/lib/db';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useTask Hook', () => {
  beforeEach(async () => {
    await db.tasks.clear();
    await db.categories.clear();
  });

  it('should create a task with default Q4 eisenhower value', async () => {
    const { result } = renderHook(() => useTask());

    const categoryId = 'cat-1';
    let task;
    
    await waitFor(async () => {
      task = await result.current.createTask(categoryId, 'Test Task');
      expect(task.title).toBe('Test Task');
      expect(task.eisenhower).toBe('Q4');
    });
  });

  it('should list tasks for a category', async () => {
    const categoryId = 'cat-1';
    await db.tasks.add({
      id: 'task-1',
      categoryId,
      title: 'Task 1',
      description: '',
      status: 'TODO',
      eisenhower: 'Q4',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const { result } = renderHook(() => useTask(categoryId));

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].title).toBe('Task 1');
    });
  });
});
