import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { CategoryTaskDetail } from '@/features/tasks/CategoryTaskDetail';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Plus } from 'lucide-react';
import { QuickCreateTaskDrawer } from '@/features/tasks/QuickCreateTaskDrawer';
import { useMedia } from 'react-use';

export const CategoryDetailPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const isMobile = useMedia('(max-width: 768px)', false);

  const category = useLiveQuery(
    () => categoryId ? db.categories.get(categoryId) : undefined,
    [categoryId]
  );

  if (!categoryId) return null;

  return (
    <div className="flex flex-col h-full bg-background relative">
      <header className="py-4 flex items-center gap-4 bg-card sticky top-0 z-10">
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

      {isMobile && (
        <Button
          className="fixed bottom-24 right-6 h-12 w-12 rounded-full shadow-2xl z-50 transition-transform active:scale-95"
          size="icon"
          onClick={() => setIsCreateTaskOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      <QuickCreateTaskDrawer
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        defaultCategoryId={categoryId}
      />
    </div>
  );
};