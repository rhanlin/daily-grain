import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { CategoryTaskDetail } from '@/features/tasks/CategoryTaskDetail';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export const CategoryDetailPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const category = useLiveQuery(
    () => categoryId ? db.categories.get(categoryId) : undefined,
    [categoryId]
  );

  if (!categoryId) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b flex items-center gap-4 bg-card sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold truncate">
          {category ? category.name : '載入中...'}
        </h1>
      </header>
      <main className="flex-1 p-4 overflow-y-auto">
        <CategoryTaskDetail categoryId={categoryId} />
      </main>
    </div>
  );
};
