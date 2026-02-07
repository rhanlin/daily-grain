import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export interface CategorySummary {
  id: string;
  name: string;
  color: string;
  todoCount: number;
  completedCount: number;
  updatedAt: string;
  orderIndex: number;
}

export const useCategorySummary = () => {
  return useLiveQuery(async () => {
    const categories = await db.categories.filter(c => !c.isArchived).toArray();
    const tasks = await db.tasks.toArray();

    const summaries: CategorySummary[] = categories.map(cat => {
      const catTasks = tasks.filter(t => t.categoryId === cat.id);
      return {
        id: cat.id,
        name: cat.name,
        color: cat.color,
        todoCount: catTasks.filter(t => t.status === 'TODO').length,
        completedCount: catTasks.filter(t => t.status === 'DONE').length,
        updatedAt: cat.updatedAt,
        orderIndex: cat.orderIndex || 0
      };
    });

    // Sort by orderIndex ascending
    return summaries.sort((a, b) => a.orderIndex - b.orderIndex);
  }, []);
};
