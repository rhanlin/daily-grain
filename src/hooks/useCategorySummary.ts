import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export interface CategorySummary {
  id: string;
  name: string;
  color: string;
  todoCount: number;
  completedCount: number;
  updatedAt: string;
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
        updatedAt: cat.updatedAt
      };
    });

    // Sort by updatedAt descending (or createdAt if preferred, but plan says newest first)
    // Actually, repository.categories.getAll was updated to sort by createdAt desc in a previous turn.
    // I'll stick to that logic if possible, or just sort by updatedAt for now if createdAt isn't indexed.
    return summaries.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, []);
};
