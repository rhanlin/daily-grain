import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  type Active
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useDailyPlan } from '@/hooks/useDailyPlan';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { DailyPlanView } from '@/features/daily-plan/DailyPlanView';
import { BacklogContent } from '@/features/daily-plan/BacklogContent';
import { DailyPlanSpeedDial } from '@/features/daily-plan/DailyPlanSpeedDial';
import { QuickAddTaskDrawer } from '@/features/daily-plan/QuickAddTaskDrawer';
import { DesktopQuickAdd } from '@/features/daily-plan/DesktopQuickAdd';
import { SideGuidePanels } from '@/features/daily-plan/SideGuidePanels';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useMedia } from 'react-use';
import { toast } from "sonner"
import { getLocalToday, addDays, subDays } from '@/lib/utils';
import { repository } from '@/lib/repository';

interface ConflictState {
  active: Active;
  existingDate: string;
}

export const DailyPlanPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(getLocalToday());
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [hideRoutine, setHideRoutine] = useState(false);
  const { planItems, addToPlan, reorderItems, moveItem } = useDailyPlan(selectedDate, { hideRoutine });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [conflict, setConflict] = useState<ConflictState | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [backlogIndex, setBacklogIndex] = useState(0);

  const hoverTimerRef = React.useRef<number | null>(null);

  const isDesktop = useMedia("(min-width: 768px)");

  const allScheduledItems = useLiveQuery(() => db.dailyPlanItems.toArray(), []);
  const scheduledMap = React.useMemo(() => {
    const map = new Map<string, string>();
    if (allScheduledItems) {
      for (const item of allScheduledItems) {
        map.set(item.refId, item.date);
      }
    }
    return map;
  }, [allScheduledItems]);

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

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    const isOverNav = over && (over.id === 'nav-prev' || over.id === 'nav-next' || over.id === 'side-panel-prev' || over.id === 'side-panel-next');

    if (isOverNav) {
      // If we are over a new nav target or just started hovering
      if (!hoverTimerRef.current) {
        hoverTimerRef.current = window.setTimeout(() => {
          const newDate = (over.id === 'nav-prev' || over.id === 'side-panel-prev') ? subDays(selectedDate, 1) : addDays(selectedDate, 1);
          setSelectedDate(newDate);
          if ('vibrate' in navigator) navigator.vibrate(10);
          hoverTimerRef.current = null;
        }, 500);
      }
    } else {
      // Clear timer if we leave nav area
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    if (!over) return;

    // US1: Handle drop on navigation arrows or side panels
    if (over.id === 'nav-prev' || over.id === 'nav-next' || over.id === 'side-panel-prev' || over.id === 'side-panel-next') {
      // Use the already updated selectedDate as the targetDate
      const targetDate = selectedDate;
      // Search in ALL scheduled items because selectedDate (and thus planItems) might have shifted
      const itemToMove = allScheduledItems?.find(i => i.id === active.id);
      if (itemToMove) {
        await repository.dailyPlan.moveItemToDate(itemToMove.id, targetDate);
        toast("已移動項目", { description: `已將項目移動至 ${targetDate}` });
      }
      return;
    }

    if (over.id === 'daily-plan-dropzone' && active.data.current?.type === 'BACKLOG_ITEM') {
      const { refId, refType } = active.data.current as { refId: string, refType: 'TASK' | 'SUBTASK' };
      const result = await addToPlan(refId, refType);
      
      if (result.status === 'conflict' && result.existingItem) {
        setConflict({ active, existingDate: result.existingItem.date });
        return;
      }
      if(result.status === 'added') {
        toast("已新增至計畫", { description: `已將項目加入 ${selectedDate} 的計畫中。` });
        setIsDrawerOpen(false);
      }
    }

    if (active.id !== over.id && active.data.current?.sortable?.containerId === 'daily-plan' && over.data.current?.sortable) {
      const oldIndex = planItems.findIndex(item => item.id === active.id);
      const newIndex = planItems.findIndex(item => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(planItems, oldIndex, newIndex);
        await reorderItems(newOrder.map(item => item.id));
      }
    }
  };

  // We need to resolve data for the active item if it's from the plan
  // Since useLiveQuery is async, we might just show a simplified version or 
  // use the already resolved displayItems if we lift them up.
  // For now, let's keep it simple but better than just text.

  const handleConfirmMove = async () => {
    if (conflict) {
      const { refId } = conflict.active.data.current as { refId: string };
      const itemToMove = allScheduledItems?.find(item => item.refId === refId);
      if (itemToMove) {
        await moveItem(itemToMove.id, selectedDate);
        toast("已移動項目", { description: `已將項目從 ${conflict.existingDate} 移動至 ${selectedDate}。` });
      }
      setConflict(null);
    }
  };

  const handleCancelMove = () => {
    setConflict(null);
  };

  const handleItemTap = async (refId: string, refType: 'TASK' | 'SUBTASK') => {
    if (isDesktop) return; // Tap-to-add is mobile only

    const result = await addToPlan(refId, refType);

    if (result.status === 'conflict' && result.existingItem) {
       const itemToMove = allScheduledItems?.find(item => item.refId === refId);
       if(itemToMove) {
         await moveItem(itemToMove.id, selectedDate);
         toast("檢測到衝突", { description: `項目已從 ${result.existingItem.date} 移動至 ${selectedDate}。` });
       }
    }
    if(result.status === 'added') {
      toast("已新增至計畫", { description: `已將項目加入 ${selectedDate} 的計畫中。` });
    }
    setIsDrawerOpen(false);
  }

  return (
    <>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex pt-2 h-[calc(100vh-120px-0.5rem)] sm:h-[calc(100vh-57px-0.5rem)]">
          <div className="flex-1 h-full overflow-y-auto md:pr-4 md:py-2">
            <DailyPlanView 
              selectedDate={selectedDate} 
              onDateChange={setSelectedDate} 
              onQuickAdd={() => setIsQuickAddOpen(true)}
              hideRoutine={hideRoutine}
              onToggleHideRoutine={() => setHideRoutine(!hideRoutine)}
            />
          </div>

          {isDesktop ? (
            <div className="w-[350px] border-l flex flex-col h-full overflow-hidden">
              <DesktopQuickAdd selectedDate={selectedDate} />
              <div className="flex-1 overflow-y-auto">
                <BacklogContent 
                  selectedDate={selectedDate}
                  scheduledMap={scheduledMap}
                  isDesktop={isDesktop}
                  onItemTap={handleItemTap}
                  activeIndex={backlogIndex}
                  onActiveIndexChange={setBacklogIndex}
                  onClose={() => setIsDrawerOpen(false)}
                />
              </div>
            </div>
          ) : (
            <>
              <DailyPlanSpeedDial 
                onOpenBacklog={() => setIsDrawerOpen(true)}
                onOpenQuickAdd={() => setIsQuickAddOpen(true)}
              />
              
              <Drawer repositionInputs={false} open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent className="h-[75vh]">
                  <BacklogContent 
                    selectedDate={selectedDate}
                    scheduledMap={scheduledMap}
                    isDesktop={isDesktop}
                    onItemTap={handleItemTap}
                    activeIndex={backlogIndex}
                    onActiveIndexChange={setBacklogIndex}
                    onClose={() => setIsDrawerOpen(false)}
                  />
                </DrawerContent>
              </Drawer>
            </>
          )}
        </div>

        {/* Mobile Quick Add Drawer */}
        {!isDesktop && (
          <QuickAddTaskDrawer
            open={isQuickAddOpen}
            onOpenChange={setIsQuickAddOpen}
            selectedDate={selectedDate}
          />
        )}

        <DragOverlay adjustScale={false} dropAnimation={null}>
          {activeId ? (
            <div className="w-full max-w-[calc(100vw-2rem)] md:max-w-[400px] pointer-events-none">
              <div className="bg-card border-2 border-primary/10 rounded-xl px-4 py-3 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)] scale-[1.02] transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-foreground">正在移動項目</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">放開以完成規劃</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>

        <SideGuidePanels isVisible={!!activeId} />
      </DndContext>

      {conflict && (
        <Dialog open={!!conflict} onOpenChange={handleCancelMove}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>確認移動項目？</DialogTitle>
              <DialogDescription>
                此項目已在 {conflict.existingDate} 的計畫中。您確定要將它移動到 {selectedDate} 嗎？
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={handleCancelMove}>取消</Button>
              <Button onClick={handleConfirmMove}>確認移動</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
