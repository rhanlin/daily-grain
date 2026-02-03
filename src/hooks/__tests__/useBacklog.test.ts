import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBacklog } from '../useBacklog';
import { db } from '@/lib/db';

describe('useBacklog', () => {
  beforeEach(async () => {
    await db.categories.clear();
    await db.tasks.clear();
    await db.dailyPlanItems.clear();
    await db.subtasks.clear();
  });

  it('should group unscheduled tasks by category', async () => {
    const cat1 = { id: 'cat1', name: 'Cat 1', color: '#000', isArchived: false, createdAt: '', updatedAt: '' };
    const cat2 = { id: 'cat2', name: 'Cat 2', color: '#000', isArchived: false, createdAt: '', updatedAt: '' };
    await db.categories.bulkAdd([cat1, cat2]);

    const task1 = { id: 't1', categoryId: 'cat1', title: 'Task 1', description: '', status: 'TODO' as const, eisenhower: 'Q1' as const, updatedAt: '' };
    const task2 = { id: 't2', categoryId: 'cat2', title: 'Task 2', description: '', status: 'TODO' as const, eisenhower: 'Q2' as const, updatedAt: '' };
    await db.tasks.bulkAdd([task1, task2]);

    const { result } = renderHook(() => useBacklog('2026-02-03'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.groups).toHaveLength(2);
    expect(result.current.groups[0].category.name).toBe('Cat 1');
    expect(result.current.groups[0].tasks).toHaveLength(1);
    expect(result.current.groups[1].category.name).toBe('Cat 2');
    expect(result.current.groups[1].tasks).toHaveLength(1);
  });

  it('should filter out scheduled tasks', async () => {
    const cat1 = { id: 'cat1', name: 'Cat 1', color: '#000', isArchived: false, createdAt: '', updatedAt: '' };
    await db.categories.add(cat1);

    const task1 = { id: 't1', categoryId: 'cat1', title: 'Task 1', description: '', status: 'TODO' as const, eisenhower: 'Q1' as const, updatedAt: '' };
    await db.tasks.add(task1);

    await db.dailyPlanItems.add({
      id: 'p1',
      date: '2026-02-03',
      refId: 't1',
      refType: 'TASK',
      orderIndex: 1,
      isRollover: false,
      updatedAt: ''
    });

    const { result } = renderHook(() => useBacklog('2026-02-03'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.groups).toHaveLength(0);
  });
});
