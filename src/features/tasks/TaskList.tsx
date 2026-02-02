import React from 'react';
import { useTask } from '@/hooks/useTask';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  categoryId: string;
}

export const TaskList: React.FC<TaskListProps> = ({ categoryId }) => {
  const { tasks, loading } = useTask(categoryId);

  if (loading) return <p className="text-xs text-muted-foreground italic">載入中...</p>;

  return (
    <div className="space-y-2 mt-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
      {tasks.length === 0 && (
        <p className="text-[10px] text-muted-foreground italic pl-2">尚無任務</p>
      )}
    </div>
  );
};
