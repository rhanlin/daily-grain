import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCategorySummary } from '../useCategorySummary';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

describe('useCategorySummary', () => {
  beforeEach(async () => {
    await db.categories.clear();
    await db.tasks.clear();
  });

  it('should return aggregated counts for categories', async () => {
    const catId = uuidv4();
    await db.categories.add({
      id: catId,
      name: 'Test Category',
      color: '#ff0000',
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      orderIndex: 0
    });

    await db.tasks.bulkAdd([
      {
        id: uuidv4(),
        categoryId: catId,
        title: 'Task 1',
        description: '',
        status: 'TODO',
        eisenhower: 'Q1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        categoryId: catId,
        title: 'Task 2',
        description: '',
        status: 'DONE',
        eisenhower: 'Q2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]);

    const { result } = renderHook(() => useCategorySummary());

    await waitFor(() => expect(result.current).not.toBeUndefined());

    expect(result.current).toHaveLength(1);
    expect(result.current![0]).toMatchObject({
      name: 'Test Category',
      todoCount: 1,
      completedCount: 1,
    });
  });

  it('should exclude archived categories', async () => {
    await db.categories.add({
      id: uuidv4(),
      name: 'Archived',
      color: '#000',
      isArchived: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      orderIndex: 0
    });

    const { result } = renderHook(() => useCategorySummary());

    await waitFor(() => expect(result.current).not.toBeUndefined());
    expect(result.current).toHaveLength(0);
  });
});
