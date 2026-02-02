import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { repository } from '@/lib/repository';

export const useCategory = () => {
  const categories = useLiveQuery(
    () => repository.categories.getAll(),
    []
  );

  const createCategory = async (name: string, color: string) => {
    return await repository.categories.create(name, color);
  };

  const updateCategory = async (id: string, updates: any) => {
    await repository.categories.update(id, updates);
  };

  return {
    categories: categories || [],
    createCategory,
    updateCategory,
    loading: categories === undefined
  };
};
