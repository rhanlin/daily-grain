import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { repository } from '@/lib/repository';

export const useTask = (categoryId?: string) => {
  const tasks = useLiveQuery(
    () => categoryId ? repository.tasks.getByCategory(categoryId) : db.tasks.toArray(),
    [categoryId]
  );

  const createTask = async (categoryId: string, title: string, description: string = '') => {
    return await repository.tasks.create(categoryId, title, description);
  };

  const updateTask = async (id: string, updates: any) => {
    await repository.tasks.update(id, updates);
  };

  const deleteTask = async (id: string) => {
    await repository.tasks.delete(id);
  };

  return {
    tasks: tasks || [],
    createTask,
    updateTask,
    deleteTask,
    loading: tasks === undefined
  };
};
