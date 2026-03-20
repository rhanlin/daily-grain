import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { repository } from '@/lib/repository';
import { rolloverUnfinishedItems } from '@/lib/rollover';
import { getLocalToday } from '@/lib/utils';

export const useDailyPlan = (date: string, options?: { hideRoutine?: boolean }) => {
  const planItems = useLiveQuery(
    async () => {
      const items = await repository.dailyPlan.getByDate(date);
      // Filter items to exclude archived task references
      const resolvedItems = [];
      for (const item of items) {
        let shouldInclude = true;
        if (item.refType === 'TASK') {
          const task = await db.tasks.get(item.refId);
          if (!task || task.status === 'ARCHIVED') {
            shouldInclude = false;
          }
        } else if (item.refType === 'SUBTASK') {
          const subtask = await db.subtasks.get(item.refId);
          if (subtask) {
            const parentTask = await db.tasks.get(subtask.taskId);
            if (!parentTask || parentTask.status === 'ARCHIVED') {
              shouldInclude = false;
            }
            // US2: Filter out daily subtasks if requested
            if (options?.hideRoutine && subtask.type === 'daily') {
              shouldInclude = false;
            }
          } else {
            shouldInclude = false;
          }
        }
        
        if (shouldInclude) {
          resolvedItems.push(item);
        }
      }
      return resolvedItems;
    },
    [date, options?.hideRoutine]
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
    // ids contains the new order of visible items
    // We need to fetch ALL items for this date to preserve hidden ones
    const allItems = await repository.dailyPlan.getByDate(date);
    const visibleIdsSet = new Set(ids);
    
    // Construct new order: merge visible items in their new order 
    // with hidden items in their original relative positions.
    const newFullOrderIds = [...allItems.map(i => i.id)];
    
    // Map visible items to their new positions in the full list
    let visibleIdx = 0;
    for (let i = 0; i < newFullOrderIds.length; i++) {
        if (visibleIdsSet.has(newFullOrderIds[i])) {
            newFullOrderIds[i] = ids[visibleIdx];
            visibleIdx++;
        }
    }

    await repository.dailyPlan.bulkUpdateOrder(newFullOrderIds);
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
