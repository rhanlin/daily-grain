import React, { useState } from 'react';
import { useCategorySummary, type CategorySummary } from '@/hooks/useCategorySummary';
import { CategoryCard } from './CategoryCard';
import { useNavigate } from 'react-router-dom';
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryActionDrawer } from './CategoryActionDrawer';
import { EditCategoryDialog } from './EditCategoryDialog';
import { QuickCreateTaskDrawer } from '@/features/tasks/QuickCreateTaskDrawer';
import { repository } from '@/lib/repository';
import { toast } from 'sonner';

export const CategoryOverview: React.FC = () => {
  const summaries = useCategorySummary();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<CategorySummary | null>(null);
  const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(false);
  const [isEditDialogOpen, setIsEditOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  if (summaries === undefined) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">載入中...</div>;
  }

  if (summaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 border-2 border-dashed rounded-lg">
        <FolderPlus className="h-12 w-12 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="text-xl font-bold">尚無分類</h3>
          <p className="text-muted-foreground">建立一個分類來開始組織您的任務。</p>
        </div>
        <Button onClick={() => navigate('/matrix')}>前往矩陣頁面建立</Button>
      </div>
    );
  }

  const handleLongPress = (cat: CategorySummary) => {
    setSelectedCategory(cat);
    setIsActionDrawerOpen(true);
  };

  const handleEditName = (cat: CategorySummary) => {
    setSelectedCategory(cat);
    setIsEditOpen(true);
  };

  const handleAddTask = (cat: CategorySummary) => {
    setSelectedCategory(cat);
    setIsAddTaskOpen(true);
  };

  const handleDelete = async (cat: CategorySummary) => {
    if (window.confirm(`確定要刪除分類「${cat.name}」嗎？相關任務也將被封存。`)) {
      try {
        await repository.categories.delete(cat.id);
        toast.success('分類已刪除');
      } catch (error) {
        console.error(error);
        toast.error('刪除失敗');
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaries.map((cat) => (
          <CategoryCard 
            key={cat.id} 
            category={cat} 
            onClick={() => {
              // If we are not in long press state, navigate
              navigate(`/category/${cat.id}`);
            }}
            onLongPress={() => handleLongPress(cat)}
          />
        ))}
      </div>

      <CategoryActionDrawer 
        category={selectedCategory}
        open={isActionDrawerOpen}
        onOpenChange={setIsActionDrawerOpen}
        onEditName={handleEditName}
        onAddTask={handleAddTask}
        onDelete={handleDelete}
      />

      <EditCategoryDialog 
        category={selectedCategory}
        open={isEditDialogOpen}
        onOpenChange={setIsEditOpen}
      />

      <QuickCreateTaskDrawer 
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        defaultCategoryId={selectedCategory?.id}
      />
    </>
  );
};
