import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, MoreHorizontal } from 'lucide-react';
import type { CategorySummary } from '@/hooks/useCategorySummary';
import { Button } from '@/components/ui/button';

interface CategoryCardProps {
  category: CategorySummary;
  onClick: () => void;
  onOpenMenu: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick, onOpenMenu }) => {
  return (
    <Card 
      className="cursor-pointer hover:bg-accent/50 transition-all active:scale-[0.98] active:opacity-90 select-none relative group" 
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-bold flex items-center gap-2 truncate pr-8">
          <div 
            className="w-3 h-3 rounded-full shrink-0" 
            style={{ backgroundColor: category.color }} 
          />
          <span className="truncate">{category.name}</span>
        </CardTitle>
        
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-3 h-8 w-8 p-0 opacity-40 group-hover:opacity-100 active:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onOpenMenu();
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Circle className="h-3 w-3" />
            <span>{category.todoCount} 任務</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            <span>{category.completedCount} 已完成</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
