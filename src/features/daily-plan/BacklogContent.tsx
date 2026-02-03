import React from 'react';
import { useBacklog } from '@/hooks/useBacklog';
import { CategorySlide } from './CategorySlide';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

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

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">載入中...</div>;
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4">
        <p className="text-sm text-muted-foreground italic">無待辦任務</p>
      </div>
    );
  }

  const planRefIds = new Set(
    Array.from(scheduledMap.entries())
      .filter(([_, date]) => date === selectedDate)
      .map(([id, _]) => id)
  );

  if (isDesktop) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-foreground">待辦清單 (Backlog)</h2>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-8 pb-20">
            {groups.map((group) => (
              <CategorySlide
                key={group.category.id}
                category={group.category}
                tasks={group.tasks}
                subtasks={group.subtasks}
                planRefIds={planRefIds}
                scheduledMap={scheduledMap}
                isDesktop={isDesktop}
                onItemTap={onItemTap}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Mobile Carousel with Placeholder at index 0
  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      <div className="p-4 border-b flex justify-between items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <h2 className="text-lg font-bold text-foreground">待辦清單</h2>
        <div className="text-[10px] font-medium bg-secondary px-2 py-0.5 rounded-full">
          {Math.max(0, activeIndex - 1) + 1} / {groups.length}
        </div>
      </div>
      
      <Carousel 
        className="w-full flex-1" 
        opts={{
          align: 'center',
          startIndex: activeIndex === 0 && groups.length > 0 ? 1 : activeIndex,
        }}
        setApi={(api) => {
          if (!api) return;
          api.on('select', () => {
            onActiveIndexChange(api.selectedScrollSnap());
          });
        }}
      >
        <CarouselContent className="h-full">
          {/* FR-034: Placeholder Slide */}
          <CarouselItem className="h-full basis-4/5 pointer-events-none opacity-0" aria-hidden="true" />
          
          {groups.map((group) => (
            <CarouselItem key={group.category.id} className="h-full p-4 basis-4/5">
              <ScrollArea className="h-[calc(75vh-120px)]">
                <CategorySlide
                  category={group.category}
                  tasks={group.tasks}
                  subtasks={group.subtasks}
                  planRefIds={planRefIds}
                  scheduledMap={scheduledMap}
                  isDesktop={isDesktop}
                  onItemTap={onItemTap}
                />
              </ScrollArea>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
