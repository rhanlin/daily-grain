import { type Task, type SubTask } from '@/lib/db';

export const getDraggableUnit = (task: Task, subtasks: SubTask[]) => {
  if (subtasks.length > 0) {
    return {
      type: 'SUBTASK',
      items: subtasks
    };
  }
  return {
    type: 'TASK',
    items: [task]
  };
};

export const reorderFiltered = <T extends { id: string }>(
  allItems: T[],
  visibleIds: string[],
  targetIds: string[]
): T[] => {
  const newOrder = [...allItems];
  const visibleIndices = allItems
    .map((item, idx) => (visibleIds.includes(item.id) ? idx : -1))
    .filter((idx) => idx !== -1);

  // Map the new order of visible IDs to the original absolute slots
  targetIds.forEach((id, i) => {
    const originalSlot = visibleIndices[i];
    const foundItem = allItems.find((item) => item.id === id);
    if (foundItem) {
      newOrder[originalSlot] = foundItem;
    }
  });

  return newOrder;
};
