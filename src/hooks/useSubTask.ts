import { useLiveQuery } from 'dexie-react-hooks';
import { repository } from '@/lib/repository';
import { db, type SubTaskType } from '@/lib/db';

export const useSubTask = (taskId: string) => {
  const subtasksWithProgress = useLiveQuery(
    async () => {
      const subs = await repository.subtasks.getByTask(taskId);
      const results = [];
      
      for (const sub of subs) {
        if (sub.type === 'multi-time' || sub.type === 'daily') {
          // T012: Efficiently count completed instances using index
          const completedCount = await db.dailyPlanItems
            .where('refId').equals(sub.id)
            .filter(item => item.isCompleted)
            .count();
          
          results.push({ ...sub, completedCount });
        } else {
          results.push({ ...sub, completedCount: sub.isCompleted ? 1 : 0 });
        }
      }
      return results;
    },
    [taskId]
  );

  const createSubTask = async (title: string, type: SubTaskType = 'one-time', repeatLimit?: number) => {
    return await repository.subtasks.create(taskId, title, type, repeatLimit);
  };

  const updateSubTask = async (id: string, updates: any) => {
    await repository.subtasks.update(id, updates);
  };

  return {
    subtasks: subtasksWithProgress || [],
    createSubTask,
    updateSubTask,
    loading: subtasksWithProgress === undefined
  };
};
