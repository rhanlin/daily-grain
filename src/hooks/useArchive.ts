import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export const useArchive = () => {
  const data = useLiveQuery(async () => {
    // Use filter instead of where for boolean indices to avoid compatibility issues with boolean keys in IDBKeyRange
    const categories = await db.categories.filter(c => !!c.isArchived).toArray();
    const tasks = await db.tasks.where('status').equals('ARCHIVED').toArray();
    const subtasks = await db.subtasks.filter(s => !!s.isArchived).toArray();

    return {
      categories,
      tasks,
      subtasks
    };
  }, []);

  return {
    archivedData: data || { categories: [], tasks: [], subtasks: [] },
    loading: data === undefined
  };
};
