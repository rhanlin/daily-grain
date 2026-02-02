import { db } from './db';
import { repository } from './repository';
import { v4 as uuidv4 } from 'uuid';

export const rolloverUnfinishedItems = async (targetDate: string) => {
  if (!targetDate) return;

  // 1. Find all previous dates that have unfinished items
  // For simplicity, we'll find all DailyPlanItems where date < targetDate AND ref object is not DONE
  
  const allItems = await db.dailyPlanItems.where('date').below(targetDate).toArray();
  
  const rolloverItems = [];
  
  for (const item of allItems) {
    let isCompleted = false;
    if (item.refType === 'TASK') {
      const task = await db.tasks.get(item.refId);
      isCompleted = task?.status === 'DONE';
    } else {
      const subtask = await db.subtasks.get(item.refId);
      isCompleted = subtask?.isCompleted || false;
    }

    if (!isCompleted) {
      rolloverItems.push(item);
    }
  }

  if (rolloverItems.length === 0) return;

  // 2. Move them to targetDate, pinned at top (negative orderIndex)
  // We'll update the items' date and mark as isRollover
  for (let i = 0; i < rolloverItems.length; i++) {
    const item = rolloverItems[i];
    await db.dailyPlanItems.update(item.id, {
      date: targetDate,
      isRollover: true,
      orderIndex: -1000 + i, // Pin to top
      updatedAt: new Date().toISOString()
    });
  }
};
