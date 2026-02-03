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
  type Active
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useDailyPlan } from '@/hooks/useDailyPlan';
import { useTask } from '@/hooks/useTask';
import { useSubTask } from '@/hooks/useSubTask';
import { CalendarIcon, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { DailyPlanView } from '@/features/daily-plan/DailyPlanView';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerTrigger, DrawerContent } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { useDraggable } from '@dnd-kit/core';
import { useMedia } from 'react-use';
import { toast } from "sonner"

interface ConflictState {
  active: Active;
  existingDate: string;
}

export const DailyPlanPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { tasks: allTasks } = useTask();
  const { planItems, addToPlan, reorderItems, moveItem } = useDailyPlan(selectedDate);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [conflict, setConflict] = useState<ConflictState | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const planRefIds = new Set(planItems.map(i => i.refId));
  
  const backlogTasks = allTasks.filter(t => {
    if (t.status === 'DONE' || t.status === 'ARCHIVED') return false;
    return true; 
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

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
       // On mobile, maybe we just move it? Or show a dialog? For now, let's just add it.
       // A better UX would be to handle this explicitly. Let's make it a move for now.
       const itemToMove = allScheduledItems?.find(item => item.refId === refId);
       if(itemToMove) {
         await moveItem(itemToMove.id, selectedDate);
         toast("已移動項目", { description: `已將項目從 ${result.existingItem.date} 移動至 ${selectedDate}。` });
       }
    }
    if(result.status === 'added') {
      toast("已新增至計畫", { description: `已將項目加入 ${selectedDate} 的計畫中。` });
    }
    setIsDrawerOpen(false);
  }

  const BacklogContent = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">待辦清單 (Backlog)</h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {backlogTasks.map((task) => (
            <BacklogDraggableItem 
              key={task.id} 
              task={task} 
              planRefIds={planRefIds} 
              scheduledMap={scheduledMap} 
              isDesktop={isDesktop}
              onItemTap={handleItemTap}
            />
          ))}
          {backlogTasks.length === 0 && (
            <p className="text-sm text-muted-foreground italic text-center py-8">
              無待辦任務
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-[calc(100vh-120px)]">
          <main className="flex-1 h-full overflow-y-auto pr-4">
            <DailyPlanView selectedDate={selectedDate} onDateChange={setSelectedDate} />
          </main>

          {isDesktop ? (
            <div className="w-[350px] border-l">
              <BacklogContent />
            </div>
          ) : (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg z-50">
                  <Plus className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[75vh]">
                  <BacklogContent />
              </DrawerContent>
            </Drawer>
          )}
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="border rounded-lg p-3 bg-card shadow-xl opacity-80 w-72">
              正在拖曳項目...
            </div>
          ) : null}
        </DragOverlay>
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

const DraggableItem = ({ id, data, children, isDesktop, onItemTap }: { id: string, data: any, children: React.ReactNode, isDesktop: boolean, onItemTap: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data,
    disabled: !isDesktop,
  });
  
  const style = transform && isDesktop ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const eventHandlers = isDesktop ? listeners : { onClick: onItemTap };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...eventHandlers} className={isDragging ? 'opacity-50' : ''}>
      {children}
    </div>
  );
};

const BacklogDraggableItem = ({ task, planRefIds, scheduledMap, isDesktop, onItemTap }: { task: any, planRefIds: Set<string>, scheduledMap: Map<string, string>, isDesktop: boolean, onItemTap: (refId: string, refType: 'TASK' | 'SUBTASK') => void }) => {
  const { subtasks } = useSubTask(task.id);

  const visibleSubtasks = subtasks.filter(s => !planRefIds.has(s.id) && !s.isCompleted);

  if (visibleSubtasks.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="space-y-2 border rounded-md p-2 bg-secondary/20">
        <p className="text-[10px] font-bold text-muted-foreground uppercase px-1">{task.title}</p>
        {visibleSubtasks.map(sub => {
          const scheduledDate = scheduledMap.get(sub.id);
          return (
            <DraggableItem 
              key={sub.id} 
              id={sub.id} 
              data={{ type: 'BACKLOG_ITEM', refId: sub.id, refType: 'SUBTASK' }}
              isDesktop={isDesktop}
              onItemTap={() => onItemTap(sub.id, 'SUBTASK')}
            >
              <div className={`p-2 bg-card border rounded shadow-sm text-sm flex justify-between items-center group ${isDesktop ? 'cursor-grab active:cursor-grabbing' : ''}`}>
                <span className='flex-1 truncate'>{sub.title}</span>
                <div className='flex items-center gap-2'>
                  {scheduledDate && !planRefIds.has(sub.id) && (
                    <Tooltip>
                      <TooltipTrigger onClick={(e) => e.stopPropagation()}>
                        <CalendarIcon className='h-3 w-3 text-muted-foreground' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>已排程於 {scheduledDate}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <Badge variant={(sub.eisenhower?.toLowerCase() || 'q4') as 'q1' | 'q2' | 'q3' | 'q4'} className="text-[8px] px-1 py-0 h-4">
                    {sub.eisenhower || 'q4'}
                  </Badge>
                </div>
              </div>
            </DraggableItem>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
