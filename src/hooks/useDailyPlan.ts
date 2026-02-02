import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { repository } from '@/lib/repository';
import { rolloverUnfinishedItems } from '@/lib/rollover';

export const useDailyPlan = (date: string) => {
  const planItems = useLiveQuery(
    () => repository.dailyPlan.getByDate(date),
    [date]
  );

  const addToPlan = async (refId: string, refType: 'TASK' | 'SUBTASK') => {
    // Check if already in plan for this date
    const existing = await db.dailyPlanItems
      .where({ date, refId })
      .first();
    
    if (existing) return;

    const maxItem = await db.dailyPlanItems.where('date').equals(date).reverse().sortBy('orderIndex');
    const nextOrder = maxItem.length > 0 ? maxItem[0].orderIndex + 1000 : 1000;
    
    await repository.dailyPlan.add(date, refId, refType, nextOrder);
  };

  const reorderItems = async (ids: string[]) => {
    // Simple implementation: update orderIndex based on array position
    for (let i = 0; i < ids.length; i++) {
      await repository.dailyPlan.updateOrder(ids[i], i * 1000);
    }
  };

  const triggerRollover = async () => {
    await rolloverUnfinishedItems(date);
  };

  return {
    planItems: planItems || [],
    addToPlan,
    reorderItems,
    triggerRollover,
    loading: planItems === undefined
  };
};
