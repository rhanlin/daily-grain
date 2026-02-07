import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../db';
import { rolloverUnfinishedItems } from '../rollover';

describe('rolloverUnfinishedItems', () => {
  beforeEach(async () => {
    await db.dailyPlanItems.clear();
    await db.tasks.clear();
    await db.subtasks.clear();
  });

  it('should rollover all unfinished items from yesterday to today', async () => {
    const yesterday = '2026-02-05';
    const today = '2026-02-06';

    // Create 3 tasks
    const t1 = { id: 't1', categoryId: 'c1', title: 'T1', status: 'TODO', description: '', eisenhower: 'Q4', createdAt: '', updatedAt: '' } as any;
    const t2 = { id: 't2', categoryId: 'c1', title: 'T2', status: 'TODO', description: '', eisenhower: 'Q4', createdAt: '', updatedAt: '' } as any;
    const t3 = { id: 't3', categoryId: 'c1', title: 'T3', status: 'DONE', description: '', eisenhower: 'Q4', createdAt: '', updatedAt: '' } as any;
    await db.tasks.bulkAdd([t1, t2, t3]);

    // Add them to yesterday's plan
    await db.dailyPlanItems.bulkAdd([
      { id: 'p1', date: yesterday, refId: 't1', refType: 'TASK', orderIndex: 0, isRollover: false, updatedAt: '' },
      { id: 'p2', date: yesterday, refId: 't2', refType: 'TASK', orderIndex: 1, isRollover: false, updatedAt: '' },
      { id: 'p3', date: yesterday, refId: 't3', refType: 'TASK', orderIndex: 2, isRollover: false, updatedAt: '' },
    ]);

    // Run rollover
    await rolloverUnfinishedItems(today);

    // Verify today's plan
    const todayItems = await db.dailyPlanItems.where('date').equals(today).toArray();
    
    // T1 and T2 should be in today's plan, T3 (DONE) should not.
    expect(todayItems).toHaveLength(2);
    expect(todayItems.find(i => i.refId === 't1')).toBeDefined();
    expect(todayItems.find(i => i.refId === 't2')).toBeDefined();
    
    // Check if they are marked as rollover
    expect(todayItems.every(i => i.isRollover)).toBe(true);
  });
});