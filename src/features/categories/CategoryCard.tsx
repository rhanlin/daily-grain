import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import type { CategorySummary } from '@/hooks/useCategorySummary';

interface CategoryCardProps {
  category: CategorySummary;
  onClick: () => void;
  onLongPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick, onLongPress }) => {
  const timerRef = React.useRef<number | null>(null);
  const touchStartPos = React.useRef({ x: 0, y: 0 });
  const isLongPressTriggered = React.useRef(false);
  const touchThreshold = 15; // 稍微放寬位移閾值

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    isLongPressTriggered.current = false;

    // 開啟 500ms 計時器
    timerRef.current = window.setTimeout(() => {
      isLongPressTriggered.current = true;
      onLongPress();
      // 在行動端觸發觸覺回饋
      if ('vibrate' in navigator) window.navigator.vibrate(50);
    }, 500) as unknown as number;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!timerRef.current) return;

    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPos.current.x);
    const dy = Math.abs(touch.clientY - touchStartPos.current.y);

    // 如果位移超過閾值，視為捲動，取消長按計時
    if (dx > touchThreshold || dy > touchThreshold) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:bg-accent/50 transition-all active:scale-95 active:opacity-80 select-none" 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
        // 如果長按已觸發，攔截後續的 click
        if (isLongPressTriggered.current) {
          isLongPressTriggered.current = false;
          return;
        }
        onClick();
      }}
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