import { db, type DailyPlanItem } from './db';

export const rolloverUnfinishedItems = async (today: string) => {
  if (!today) return;

  await db.transaction('rw', [db.dailyPlanItems, db.tasks, db.subtasks], async () => {
    // 1. Get all items from dates before today.
    const pastItems = await db.dailyPlanItems.where('date').below(today).toArray();
    
    // 2. Get all items currently in today's plan to check for existence.
    const todayItems = await db.dailyPlanItems.where('date').equals(today).toArray();
    const todayRefIds = new Set(todayItems.map(i => i.refId));

    const itemsToRollover: DailyPlanItem[] = [];
    const processedRefIds = new Set<string>();
    
    // Sort past items by date descending, so we get the most recent version if there are duplicates
    pastItems.sort((a, b) => b.date.localeCompare(a.date));

    for (const item of pastItems) {
      // 3. Prevent duplicate rollovers for the same task/subtask in the past list
      if (processedRefIds.has(item.refId)) {
        await db.dailyPlanItems.delete(item.id);
        continue;
      }
      processedRefIds.add(item.refId);

      // 4. Check if the item is already in today's plan.
      if (todayRefIds.has(item.refId)) {
        await db.dailyPlanItems.delete(item.id);
        continue;
      }

      // T020: Priority use item.isCompleted, fallback to Task/SubTask status for migration safety
      let isCompleted = item.isCompleted || false;
      
      if (!item.isCompleted) {
          if (item.refType === 'TASK') {
            const task = await db.tasks.get(item.refId);
            isCompleted = task?.status === 'DONE';
          } else {
            const subtask = await db.subtasks.get(item.refId);
            isCompleted = subtask?.isCompleted || false;
          }
      }

      if (!isCompleted) {
        itemsToRollover.push(item);
      } else {
        // If it's completed in the past, just leave it there or delete? 
        // We keep it in the past for history, unless it's a duplicate.
      }
    }

    if (itemsToRollover.length === 0) return;

    // 5. Move the valid, non-duplicate items to today's date.
    // Use a large negative offset to ensure they appear at the top but maintain relative order
    for (let i = 0; i < itemsToRollover.length; i++) {
      const item = itemsToRollover[i];
      await db.dailyPlanItems.update(item.id, {
        date: today,
        isRollover: true,
        orderIndex: -10000 + i, // Pin to top
        updatedAt: new Date().toISOString()
      });
    }
  });
};
