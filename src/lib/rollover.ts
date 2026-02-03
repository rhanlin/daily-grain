import { db } from './db';

export const rolloverUnfinishedItems = async (today: string) => {
  if (!today) return;

  // 1. Get all items from dates before today.
  const pastItems = await db.dailyPlanItems.where('date').below(today).toArray();
  
  // 2. Get all items currently in today's plan to check for existence.
  const todayItems = await db.dailyPlanItems.where('date').equals(today).toArray();
  const todayRefIds = new Set(todayItems.map(i => i.refId));

  const itemsToRollover = [];
  
  for (const item of pastItems) {
    // 3. Check if the item is already in today's plan.
    if (todayRefIds.has(item.refId)) {
      // If it is, we don't need to roll it over, but we should delete the old one.
      await db.dailyPlanItems.delete(item.id);
      continue;
    }

    let isCompleted = false;
    if (item.refType === 'TASK') {
      const task = await db.tasks.get(item.refId);
      isCompleted = task?.status === 'DONE';
    } else {
      const subtask = await db.subtasks.get(item.refId);
      isCompleted = subtask?.isCompleted || false;
    }

    if (!isCompleted) {
      itemsToRollover.push(item);
    }
  }

  if (itemsToRollover.length === 0) return;

  // 4. Move the valid, non-duplicate items to today's date.
  for (let i = 0; i < itemsToRollover.length; i++) {
    const item = itemsToRollover[i];
    await db.dailyPlanItems.update(item.id, {
      date: today,
      isRollover: true,
      orderIndex: -1000 + i, // Pin to top
      updatedAt: new Date().toISOString()
    });
  }
};
