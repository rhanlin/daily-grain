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
  type DragOverEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDailyPlan } from '@/hooks/useDailyPlan';
import { useTask } from '@/hooks/useTask';
import { useSubTask } from '@/hooks/useSubTask';
import { DailyPlanView } from '@/features/daily-plan/DailyPlanView';
import { DraggableTask } from '@/components/dnd/DraggableTask';
import { TaskItem } from '@/features/tasks/TaskItem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { db } from '@/lib/db';

export const DailyPlanPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { tasks: allTasks } = useTask();
  const { planItems, addToPlan, reorderItems } = useDailyPlan(selectedDate);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter tasks that are NOT in the current daily plan
  const planRefIds = new Set(planItems.map(i => i.refId));
  const backlogTasks = allTasks.filter(t => !planRefIds.has(t.id) && t.status !== 'DONE' && t.status !== 'ARCHIVED');

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Logic for dropping into Daily Plan from Backlog
    if (over.id === 'daily-plan-dropzone' || (over.data.current?.sortable?.containerId === 'daily-plan')) {
       // If dragging from backlog
       if (active.data.current?.type === 'BACKLOG_ITEM') {
          const { refId, refType } = active.data.current;
          await addToPlan(refId, refType);
       }
    }

    // Existing reorder logic within Daily Plan
    if (active.id !== over.id && active.data.current?.sortable?.containerId === 'daily-plan') {
      const oldIndex = planItems.findIndex(item => item.id === active.id);
      const newIndex = planItems.findIndex(item => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(planItems, oldIndex, newIndex);
        await reorderItems(newOrder.map(item => item.id));
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-120px)]">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Left Side: Backlog */}
        <aside className="w-full md:w-80 flex flex-col gap-4">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-lg font-bold">待辦清單 (Backlog)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <ScrollArea className="h-full p-4">
                <div className="space-y-3">
                  {backlogTasks.map((task) => (
                    <BacklogDraggableItem key={task.id} task={task} />
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

        {/* Right Side: Daily Plan */}
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
  );
};

const BacklogDraggableItem = ({ task }: { task: any }) => {
  const { subtasks } = useSubTask(task.id);
  
  // Decide what is draggable based on spec: 
  // "If Task has Sub-tasks, drag sub-tasks; else drag Task"
  if (subtasks.length > 0) {
    return (
      <div className="space-y-2 border rounded-md p-2 bg-secondary/20">
        <p className="text-[10px] font-bold text-muted-foreground uppercase px-1">{task.title}</p>
        {subtasks.map(sub => (
          <DraggableItem key={sub.id} id={sub.id} data={{ type: 'BACKLOG_ITEM', refId: sub.id, refType: 'SUBTASK' }}>
            <div className="p-2 bg-card border rounded shadow-sm text-sm flex justify-between items-center group">
              <span>{sub.title}</span>
              <Badge variant={sub.eisenhower?.toLowerCase() as any || 'q4'} className="text-[8px] px-1 py-0 h-4">
                {sub.eisenhower || 'Q4'}
              </Badge>
            </div>
          </DraggableItem>
        ))}
      </div>
    );
  }

  return (
    <DraggableItem id={task.id} data={{ type: 'BACKLOG_ITEM', refId: task.id, refType: 'TASK' }}>
      <TaskItem task={task} />
    </DraggableItem>
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
