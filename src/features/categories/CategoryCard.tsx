import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, MoreHorizontal } from 'lucide-react';
import type { CategorySummary } from '@/hooks/useCategorySummary';
import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CategoryCardProps {
  category: CategorySummary;
  onClick: () => void;
  onOpenMenu: () => void;
  isDragging?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  onOpenMenu,
  isDragging
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer hover:bg-accent/50 transition-all active:scale-[0.98] active:opacity-90 select-none relative group aspect-square flex flex-col justify-center items-center text-center p-4 overflow-hidden touch-none ${isDragging ? 'ring-2 ring-primary border-primary shadow-xl scale-105' : ''}`}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1 h-8 w-8 p-0 opacity-40 group-hover:opacity-100 active:opacity-100 transition-opacity z-10"
        onClick={(e) => {
          e.stopPropagation();
          onOpenMenu();
        }}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      <div
        className="w-12 h-1 rounded-full mb-4"
        style={{ backgroundColor: category.color }}
      />

      <h3 className="text-base font-bold line-clamp-2 px-2 mb-4 w-full">
        {category.name}
      </h3>

      <div className="flex flex-col gap-1 text-[10px] text-muted-foreground w-full">
        <div className="flex items-center justify-center gap-1">
          <Circle className="h-2.5 w-2.5" />
          <span>{category.todoCount} 待辦</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />
          <span>{category.completedCount} 完成</span>
        </div>
      </div>
    </Card>
  );
};

