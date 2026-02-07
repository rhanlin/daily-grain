import React, { useState } from 'react';
import { useCategorySummary, type CategorySummary } from '@/hooks/useCategorySummary';
import { CategoryCard } from './CategoryCard';
import { useNavigate } from 'react-router-dom';
import { FolderPlus } from 'lucide-react';
import { CategoryActionDrawer } from './CategoryActionDrawer';
import { EditCategoryDialog } from './EditCategoryDialog';
import { QuickCreateTaskDrawer } from '@/features/tasks/QuickCreateTaskDrawer';
import { repository } from '@/lib/repository';
import { toast } from 'sonner';

import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

export const CategoryOverview: React.FC<{ onOpenCreateCategory: () => void }> = ({ onOpenCreateCategory }) => {
  const summaries = useCategorySummary();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<CategorySummary | null>(null);
  const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(false);
  const [isEditDialogOpen, setIsEditOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id && (summaries?.length || 0) > 1) {
      const oldIndex = summaries!.findIndex((cat) => cat.id === active.id);
      const newIndex = summaries!.findIndex((cat) => cat.id === over.id);
      
      const newOrder = arrayMove(summaries!, oldIndex, newIndex);
      await repository.categories.updateOrder(newOrder.map(c => c.id));
      toast.success('排序已更新');
    }
  };

  // FR-007: 捲動恢復保障 (Scroll Restoration)
  // 當所有對話框關閉時，確保 body 的 pointer-events 恢復正常
  React.useEffect(() => {
    if (!isActionDrawerOpen && !isEditDialogOpen && !isAddTaskOpen) {
      // 延遲執行，確保 Radix UI 的清理完成後我們再做最後檢查
      const timer = setTimeout(() => {
        if (document.body.style.pointerEvents === 'none') {
          document.body.style.pointerEvents = 'auto';
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isActionDrawerOpen, isEditDialogOpen, isAddTaskOpen]);

  if (summaries === undefined) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">載入中...</div>;
  }

  if (summaries.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center p-12 text-center space-y-4 border-2 border-dashed rounded-lg"
        onClick={onOpenCreateCategory}
      >
        <FolderPlus className="h-12 w-12 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="text-xl font-bold">尚無任務管理項目</h3>
          <p className="text-muted-foreground">點擊建立一個分類來開始組織任務。</p>
        </div>
      </div>
    );
  }

  const handleOpenMenu = (cat: CategorySummary) => {
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <SortableContext 
            items={summaries.map(c => c.id)} 
            strategy={rectSortingStrategy}
          >
            {summaries.map((cat) => (
              <CategoryCard 
                key={cat.id} 
                category={cat} 
                isDragging={activeId === cat.id}
                onClick={() => {
                  navigate(`/category/${cat.id}`);
                }}
                onOpenMenu={() => handleOpenMenu(cat)}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

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