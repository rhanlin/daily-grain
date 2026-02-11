import { renderHook, waitFor } from '@testing-library/react';
import { useDailyPlan } from '../useDailyPlan';
import { db } from '@/lib/db';
import { repository } from '@/lib/repository';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useDailyPlan Hook', () => {
  beforeEach(async () => {
    await db.dailyPlanItems.clear();
  });

  it('should reorder items correctly', async () => {
    const date = '2026-02-01';
    const item1 = await repository.dailyPlan.add(date, 'ref-1', 'TASK', 1000);
    const item2 = await repository.dailyPlan.add(date, 'ref-2', 'TASK', 2000);

    const { result } = renderHook(() => useDailyPlan(date));

    await waitFor(async () => {
      await result.current.reorderItems([item2.id, item1.id]);
    });

    await waitFor(async () => {
      const updated = await repository.dailyPlan.getByDate(date);
      expect(updated[0].id).toBe(item2.id);
      expect(updated[1].id).toBe(item1.id);
    });
  });

  it('should exclude items from archived tasks (US2)', async () => {
    const date = '2026-02-01';
    const cat = await repository.categories.create('Cat', '#000');
    const task = await repository.tasks.create(cat.id, 'Task 1');
    const subtask = await repository.subtasks.create(task.id, 'Subtask 1');

    await repository.dailyPlan.add(date, task.id, 'TASK', 1000);
    await repository.dailyPlan.add(date, subtask.id, 'SUBTASK', 2000);

    const { result } = renderHook(() => useDailyPlan(date));
    await waitFor(() => expect(result.current.planItems).toHaveLength(2));

    // Archive the task
    await db.tasks.update(task.id, { status: 'ARCHIVED' });

    // Should disappear from plan view (but remain in DB until manually removed or cleanup logic runs)
    // Note: useDailyPlan implementation filters them out on the fly
    const { result: resultAfter } = renderHook(() => useDailyPlan(date));
    await waitFor(() => expect(resultAfter.current.planItems).toHaveLength(0));
  });
});
