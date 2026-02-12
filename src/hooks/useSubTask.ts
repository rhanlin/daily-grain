import { useLiveQuery } from 'dexie-react-hooks';
import { repository } from '@/lib/repository';

export const useSubTask = (taskId: string) => {
  const subtasks = useLiveQuery(
    () => repository.subtasks.getByTask(taskId),
    [taskId]
  );

  const createSubTask = async (title: string) => {
    return await repository.subtasks.create(taskId, title);
  };

  const updateSubTask = async (id: string, updates: any) => {
    await repository.subtasks.update(id, updates);
  };

  return {
    subtasks: subtasks || [],
    createSubTask,
    updateSubTask,
    loading: subtasks === undefined
  };
};
