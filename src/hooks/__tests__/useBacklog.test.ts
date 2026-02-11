import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBacklog } from '../useBacklog';
import { db } from '@/lib/db';
import { repository } from '@/lib/repository';

describe('useBacklog - 過濾優化驗證', () => {
  beforeEach(async () => {
    await db.categories.clear();
    await db.tasks.clear();
    await db.dailyPlanItems.clear();
    await db.subtasks.clear();
  });

  it('應隱藏無子任務的 Task (FR-003)', async () => {
    const cat1 = { id: 'cat1', name: 'Cat 1', color: '#000', isArchived: false, createdAt: '', updatedAt: '', orderIndex: 0 };
    await db.categories.add(cat1);

    // 建立一個沒有子任務的 Task
    await db.tasks.add({ id: 't1', categoryId: 'cat1', title: 'Empty Task', status: 'TODO', description: '', eisenhower: 'Q1', createdAt: '', updatedAt: '' });

    const { result } = renderHook(() => useBacklog('2026-02-03'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    // 因為沒有子任務，應被隱藏
    expect(result.current.groups).toHaveLength(0);
  });

  it('應在所有子任務都排程後隱藏 Task (FR-003)', async () => {
    const cat1 = { id: 'cat1', name: 'Cat 1', color: '#000', isArchived: false, createdAt: '', updatedAt: '', orderIndex: 0 };
    await db.categories.add(cat1);

    await db.tasks.add({ id: 't1', categoryId: 'cat1', title: 'Task with Subs', status: 'TODO', description: '', eisenhower: 'Q1', createdAt: '', updatedAt: '' });
    await db.subtasks.bulkAdd([
      { id: 's1', taskId: 't1', title: 'Sub 1', isCompleted: false, eisenhower: 'Q1', createdAt: '', updatedAt: '' },
      { id: 's2', taskId: 't1', title: 'Sub 2', isCompleted: false, eisenhower: 'Q1', createdAt: '', updatedAt: '' }
    ]);

    // 初始狀態應顯示
    const { result } = renderHook(({ date }) => useBacklog(date), {
      initialProps: { date: '2026-02-03' }
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.groups).toHaveLength(1);
    expect(result.current.groups[0].tasks).toHaveLength(1);

    // 將 s1 加入計畫
    await db.dailyPlanItems.add({ id: 'p1', date: '2026-02-03', refId: 's1', refType: 'SUBTASK', orderIndex: 1, isRollover: false, updatedAt: '' });
    await waitFor(() => expect(result.current.groups[0].subtasks).toHaveLength(1)); // 剩餘 s2

    // 將 s2 加入計畫
    await db.dailyPlanItems.add({ id: 'p2', date: '2026-02-03', refId: 's2', refType: 'SUBTASK', orderIndex: 2, isRollover: false, updatedAt: '' });
    
    // 現在 Task 應隱藏
    await waitFor(() => expect(result.current.groups).toHaveLength(0));
  });

  it('應支援全域排程過濾 (Research Decision)', async () => {
    const cat1 = { id: 'cat1', name: 'Cat 1', color: '#000', isArchived: false, createdAt: '', updatedAt: '', orderIndex: 0 };
    await db.categories.add(cat1);

    await db.tasks.add({ id: 't1', categoryId: 'cat1', title: 'Task with Subs', status: 'TODO', description: '', eisenhower: 'Q1', createdAt: '', updatedAt: '' });
    await db.subtasks.add({ id: 's1', taskId: 't1', title: 'Sub 1', isCompleted: false, eisenhower: 'Q1', createdAt: '', updatedAt: '' });

    // s1 被排程在「明天」
    await db.dailyPlanItems.add({ id: 'p1', date: '2026-02-04', refId: 's1', refType: 'SUBTASK', orderIndex: 1, isRollover: false, updatedAt: '' });

    const { result } = renderHook(() => useBacklog('2026-02-03')); // 檢視今天
    await waitFor(() => expect(result.current.loading).toBe(false));

    // s1 已被全球性排程，所以今天不應出現在 Backlog
    expect(result.current.groups).toHaveLength(0);
  });

  it('應隱藏已封存 Task 的子任務 (US2)', async () => {
    const cat1 = { id: 'cat1', name: 'Cat 1', color: '#000', isArchived: false, createdAt: '', updatedAt: '', orderIndex: 0 };
    await db.categories.add(cat1);

    // 建立一個已封存的 Task 和其子任務
    const task = await repository.tasks.create('cat1', 'Archived Task');
    await db.tasks.update(task.id, { status: 'ARCHIVED' });
    await db.subtasks.add({ id: 's1', taskId: task.id, title: 'Archived Sub', isCompleted: false, eisenhower: 'Q1', createdAt: '', updatedAt: '' });

    const { result } = renderHook(() => useBacklog('2026-02-03'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    // 因為 Task 已封存，應被隱藏
    expect(result.current.groups).toHaveLength(0);
  });
});
