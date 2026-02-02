import { db } from '@/lib/db';
import { repository } from '@/lib/repository';
import { rolloverUnfinishedItems } from '@/lib/rollover';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Rollover Service', () => {
  beforeEach(async () => {
    await db.tasks.clear();
    await db.subtasks.clear();
    await db.dailyPlanItems.clear();
    await db.categories.clear();
  });

  it('should move unfinished items from yesterday to today', async () => {
    const cat = await repository.categories.create('Work', 'blue');
    const task = await repository.tasks.create(cat.id, 'Unfinished Task');
    
    const yesterday = '2026-01-31';
    const today = '2026-02-01';

    await repository.dailyPlan.add(yesterday, task.id, 'TASK', 1);

    await rolloverUnfinishedItems(today);

    const todayItems = await db.dailyPlanItems.where('date').equals(today).toArray();
    expect(todayItems).toHaveLength(1);
    expect(todayItems[0].refId).toBe(task.id);
    expect(todayItems[0].isRollover).toBe(true);
    expect(todayItems[0].orderIndex).toBeLessThan(0);
  });

  it('should NOT move finished items', async () => {
    const cat = await repository.categories.create('Work', 'blue');
    const task = await repository.tasks.create(cat.id, 'Finished Task');
    await repository.tasks.update(task.id, { status: 'DONE' });
    
    const yesterday = '2026-01-31';
    const today = '2026-02-01';

    await repository.dailyPlan.add(yesterday, task.id, 'TASK', 1);

    await rolloverUnfinishedItems(today);

    const todayItems = await db.dailyPlanItems.where('date').equals(today).toArray();
    expect(todayItems).toHaveLength(0);
  });
});
