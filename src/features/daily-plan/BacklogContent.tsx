import React from 'react';
import { useBacklog } from '@/hooks/useBacklog';
import { CategorySlide } from './CategorySlide';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDailyPlan } from '@/hooks/useDailyPlan';
import { toast } from 'sonner';

interface BacklogContentProps {
  selectedDate: string;
  scheduledMap: Map<string, string>;
  isDesktop: boolean;
  onItemTap: (refId: string, refType: 'TASK' | 'SUBTASK') => void;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}

export const BacklogContent: React.FC<BacklogContentProps> = ({
  selectedDate,
  scheduledMap,
  isDesktop,
  onItemTap,
  activeIndex,
  onActiveIndexChange,
}) => {
  const { groups, loading } = useBacklog(selectedDate);
  const { addToPlan } = useDailyPlan(selectedDate);

  // FR-002: Multi-select state (Category Scope)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const resetSelection = () => {
    setSelectedIds(new Set());
    setActiveCategoryId(null);
  };

  const toggleSelection = (subTaskId: string, categoryId: string) => {
    // FR-002: Same Category Restriction logic
    if (activeCategoryId && activeCategoryId !== categoryId) {
      // Choice B: Automatically switch selection scope to the new category
      const newSet = new Set<string>();
      newSet.add(subTaskId);
      setSelectedIds(newSet);
      setActiveCategoryId(categoryId);
      return;
    }

    const newSet = new Set(selectedIds);
    if (newSet.has(subTaskId)) {
      newSet.delete(subTaskId);
      if (newSet.size === 0) {
        setActiveCategoryId(null);
      }
    } else {
      newSet.add(subTaskId);
      setActiveCategoryId(categoryId);
    }
    setSelectedIds(newSet);
  };

  const batchAddToPlan = async () => {
    if (selectedIds.size === 0) return;
    
    try {
      // Logic for confirming and adding multiple items
      for (const id of selectedIds) {
        await addToPlan(id, 'SUBTASK');
      }
      toast.success(`已將 ${selectedIds.size} 個項目加入計畫`);
      resetSelection();
    } catch (e) {
      toast.error('批次加入失敗');
      console.error(e);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">載入中...</div>;
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4">
        <p className="text-sm text-muted-foreground italic">無任務項目</p>
      </div>
    );
  }

  const selectionProps = {
    isSelectionMode: selectedIds.size > 0,
    selectedIds,
    activeCategoryId,
    onToggleSelection: toggleSelection,
    onStartSelection: (subTaskId: string, categoryId: string) => {
      const newSet = new Set<string>();
      newSet.add(subTaskId);
      setSelectedIds(newSet);
      setActiveCategoryId(categoryId);
      if ('vibrate' in navigator) navigator.vibrate(50);
    }
  };

  if (isDesktop) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-foreground">任務清單 (Backlog)</h2>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-8 pb-20">
            {groups.map((group) => (
              <CategorySlide
                key={group.category.id}
                category={group.category}
                tasks={group.tasks}
                subtasks={group.subtasks}
                scheduledMap={scheduledMap}
                isDesktop={isDesktop}
                onItemTap={onItemTap}
                {...selectionProps}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Mobile Carousel with Sticky Boundary logic
  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full relative">
      <div className="p-4 border-b flex justify-between items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <h2 className="text-lg font-bold text-foreground">任務清單</h2>
        <div className="text-[10px] font-medium bg-secondary px-2 py-0.5 rounded-full">
          {Math.max(0, activeIndex - 1) + 1} / {groups.length}
        </div>
      </div>
      
      <Carousel 
        className="w-full flex-1" 
        opts={{
          align: 'center',
          startIndex: activeIndex === 0 && groups.length > 0 ? 1 : activeIndex,
          duration: 25, // 稍微調快動畫速度增加物理感
        }}
        setApi={(api) => {
          if (!api) return;
          
          api.on('select', () => {
            const current = api.selectedScrollSnap();
            // FR-005: 如果滑入索引 0 (Placeholder)，自動彈回索引 1
            if (current === 0) {
              // 使用彈簧感的回彈
              setTimeout(() => api.scrollTo(1), 10);
            } else {
              onActiveIndexChange(current);
            }
          });

          // 初始化時確保不在 0
          if (api.selectedScrollSnap() === 0 && groups.length > 0) {
            api.scrollTo(1, true);
          }
        }}
      >
        <CarouselContent className="h-full">
          {/* FR-034: Placeholder Slide - 採完全隔離設計 */}
          <CarouselItem className="h-full basis-4/5 pointer-events-none opacity-0 select-none" aria-hidden="true" />
          
          {groups.map((group, idx) => (
            <CarouselItem key={group.category.id} className="h-full p-4 basis-4/5">
              <motion.div
                initial={false}
                animate={{
                  scale: activeIndex === idx + 1 ? 1 : 0.95,
                  opacity: activeIndex === idx + 1 ? 1 : 0.6
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-full"
              >
                <ScrollArea className="h-[calc(75vh-120px)]">
                  <CategorySlide
                    category={group.category}
                    tasks={group.tasks}
                    subtasks={group.subtasks}
                    scheduledMap={scheduledMap}
                    isDesktop={isDesktop}
                    onItemTap={onItemTap}
                    {...selectionProps}
                  />
                </ScrollArea>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* FR-003: Floating Action Bar */}
      {selectedIds.size > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur border-t z-50 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-full duration-200">
          <Button variant="ghost" onClick={resetSelection}>取消</Button>
          <Button className="flex-1" onClick={batchAddToPlan}>
            加入今日計畫 ({selectedIds.size})
          </Button>
        </div>
      )}
    </div>
  );
};