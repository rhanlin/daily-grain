import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
import { CalendarIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { DailyPlanView } from '@/features/daily-plan/DailyPlanView';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const planRefIds = new Set(planItems.map(i => i.refId));
  
  const backlogTasks = allTasks.filter(t => {
    if (t.status === 'DONE' || t.status === 'ARCHIVED') return false;
    // Do not show parent task in backlog if it has no sub-tasks, based on new sub-task only rule
    // This logic is handled inside BacklogDraggableItem now.
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
      }
      setConflict(null);
    }
  };

  const handleCancelMove = () => {
    setConflict(null);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-120px)]">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <aside className="w-full md:w-80 flex flex-col gap-4">
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardHeader className="p-4 border-b">
                <CardTitle className="text-lg font-bold">待辦清單 (Backlog)</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-3">
                    {backlogTasks.map((task) => (
                      <BacklogDraggableItem key={task.id} task={task} planRefIds={planRefIds} scheduledMap={scheduledMap} />
                    ))}
                    {backlogTasks.length === 0 && (
                      <p className="text-sm text-muted-foreground italic text-center py-8">
                        無待辦任務
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1 overflow-y-auto">
            <DailyPlanView selectedDate={selectedDate} onDateChange={setSelectedDate} />
          </main>

          <DragOverlay>
            {activeId ? (
              <div className="border rounded-lg p-3 bg-card shadow-xl opacity-80 w-64">
                正在拖曳項目...
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

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

import { useDraggable } from '@dnd-kit/core';

const DraggableItem = ({ id, data, children }: { id: string, data: any, children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

import { Badge } from '@/components/ui/badge';
const BacklogDraggableItem = ({ task, planRefIds, scheduledMap }: { task: any, planRefIds: Set<string>, scheduledMap: Map<string, string> }) => {
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
            <DraggableItem key={sub.id} id={sub.id} data={{ type: 'BACKLOG_ITEM', refId: sub.id, refType: 'SUBTASK' }}>
              <div className="p-2 bg-card border rounded shadow-sm text-sm flex justify-between items-center group cursor-grab active:cursor-grabbing">
                <span className='flex-1 truncate'>{sub.title}</span>
                <div className='flex items-center gap-2'>
                  {scheduledDate && (
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
