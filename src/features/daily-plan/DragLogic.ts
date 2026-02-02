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
