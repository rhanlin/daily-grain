import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import type { CategorySummary } from '@/hooks/useCategorySummary';

interface CategoryCardProps {
  category: CategorySummary;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:bg-accent/50 transition-colors active:scale-[0.98]" 
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: category.color }} 
          />
          {category.name}
        </CardTitle>
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
