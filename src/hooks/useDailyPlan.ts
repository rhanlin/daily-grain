import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { repository } from '@/lib/repository';
import { rolloverUnfinishedItems } from '@/lib/rollover';
import { getLocalToday } from '@/lib/utils';

export const useDailyPlan = (date: string) => {
  const planItems = useLiveQuery(
    async () => {
      const items = await repository.dailyPlan.getByDate(date);
      // Filter items to exclude archived task references
      const filteredItems = [];
      for (const item of items) {
        if (item.refType === 'TASK') {
          const task = await db.tasks.get(item.refId);
          if (task && task.status !== 'ARCHIVED') {
            filteredItems.push(item);
          }
        } else if (item.refType === 'SUBTASK') {
          const subtask = await db.subtasks.get(item.refId);
          if (subtask) {
            const parentTask = await db.tasks.get(subtask.taskId);
            if (parentTask && parentTask.status !== 'ARCHIVED') {
              filteredItems.push(item);
            }
          }
        }
      }
      return filteredItems;
    },
    [date]
  );

  const addToPlan = async (refId: string, refType: 'TASK' | 'SUBTASK') => {
    // T019: Multi-time/Daily subtasks can be added to multiple dates
    let isRecurring = false;
    if (refType === 'SUBTASK') {
        const sub = await db.subtasks.get(refId);
        if (sub && (sub.type === 'multi-time' || sub.type === 'daily')) {
            isRecurring = true;
        }
    }

    // Check if the item exists on any date
    const existingItems = await db.dailyPlanItems.where('refId').equals(refId).toArray();
    const existingOnCurrentDate = existingItems.find(item => item.date === date);

    if (existingOnCurrentDate) {
      return { status: 'noop' };
    }

    if (existingItems.length > 0 && !isRecurring) {
      // If it exists on a different date and is NOT recurring, signal a conflict.
      return { status: 'conflict', existingItem: existingItems[0] };
    }

    // If it doesn't exist on current date (and either doesn't exist elsewhere or is recurring), add it.
    const maxItem = await db.dailyPlanItems.where('date').equals(date).reverse().sortBy('orderIndex');
    const nextOrder = maxItem.length > 0 ? maxItem[0].orderIndex + 1000 : 1000;
    
    await repository.dailyPlan.add(date, refId, refType, nextOrder);
    return { status: 'added' };
  };

  const moveItem = async (itemId: string, newDate: string) => {
    // This function moves an existing DailyPlanItem to a new date.
    await db.dailyPlanItems.update(itemId, { 
      date: newDate,
      isRollover: false, // Reset rollover status on manual move
      updatedAt: new Date().toISOString() 
    });
  };

  const removeFromPlan = async (id: string) => {
    await db.dailyPlanItems.delete(id);
  };

  const reorderItems = async (ids: string[]) => {
    // Simple implementation: update orderIndex based on array position
    for (let i = 0; i < ids.length; i++) {
      await repository.dailyPlan.updateOrder(ids[i], i * 1000);
    }
  };

  const triggerRollover = async () => {
    const today = getLocalToday();
    if (date === today) {
      await rolloverUnfinishedItems(date);
    }
  };

  return {
    planItems: planItems || [],
    addToPlan,
    moveItem,
    removeFromPlan,
    reorderItems,
    triggerRollover,
    loading: planItems === undefined
  };
};
