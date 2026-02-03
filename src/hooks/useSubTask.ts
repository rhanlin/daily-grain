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
    
    // Check for auto-completion of parent task
    const allSubs = await repository.subtasks.getByTask(taskId);
    const allDone = allSubs.every(s => s.isCompleted);
    if (allDone && allSubs.length > 0) {
      await repository.tasks.update(taskId, { status: 'DONE', completedAt: new Date().toISOString() });
    } else {
      await repository.tasks.update(taskId, { status: 'TODO', completedAt: undefined });
    }
  };

  return {
    subtasks: subtasks || [],
    createSubTask,
    updateSubTask,
    loading: subtasks === undefined
  };
};
