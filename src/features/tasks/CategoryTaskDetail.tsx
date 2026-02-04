import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { TaskItem } from './TaskItem';

interface CategoryTaskDetailProps {
  categoryId: string;
}

export const CategoryTaskDetail: React.FC<CategoryTaskDetailProps> = ({ categoryId }) => {
  const tasks = useLiveQuery(
    () => db.tasks.where('categoryId').equals(categoryId).reverse().sortBy('createdAt'),
    [categoryId]
  );

  if (tasks === undefined) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">載入中...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground italic">
        此分類尚無任務。
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {tasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          viewMode="category-detail" 
          defaultOpen={true}
        />
      ))}
    </div>
  );
};