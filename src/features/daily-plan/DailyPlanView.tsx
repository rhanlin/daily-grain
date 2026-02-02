import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  type DragStartEvent,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDailyPlan } from '@/hooks/useDailyPlan';
import { PlanToolbar } from './PlanToolbar';
import { DraggableTask } from '@/components/dnd/DraggableTask';
import { TaskItem } from '../tasks/TaskItem';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export const DailyPlanView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { planItems, reorderItems, triggerRollover } = useDailyPlan(selectedDate);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sortByMatrix, setSortByMatrix] = useState(false);

  useEffect(() => {
    triggerRollover();
  }, [selectedDate]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // We need the actual Task/Subtask objects to render
  const resolvedItems = useLiveQuery(async () => {
    const results = [];
    for (const item of planItems) {
      let data;
      if (item.refType === 'TASK') {
        data = await db.tasks.get(item.refId);
      } else {
        data = await db.subtasks.get(item.refId);
      }
      results.push({ ...item, data });
    }
    return results;
  }, [planItems]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = planItems.findIndex(item => item.id === active.id);
      const newIndex = planItems.findIndex(item => item.id === over.id);
      
      const newOrder = arrayMove(planItems, oldIndex, newIndex);
      await reorderItems(newOrder.map(item => item.id));
    }
  };

  const displayItems = resolvedItems || [];
  
  // Sort by Matrix if toggled
  const sortedDisplayItems = [...displayItems].sort((a, b) => {
    if (!sortByMatrix) return 0;
    // Manual sort by Eisenhower weight (Q1 > Q2 > Q3 > Q4)
    const weights: Record<string, number> = { 'Q1': 1, 'Q2': 2, 'Q3': 3, 'Q4': 4 };
    const weightA = a.data?.eisenhower ? weights[a.data.eisenhower] : 5;
    const weightB = b.data?.eisenhower ? weights[b.data.eisenhower] : 5;
    return weightA - weightB;
  });

  return (
    <div className="space-y-6">
      <PlanToolbar 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
        sortByMatrix={sortByMatrix}
        onToggleSort={() => setSortByMatrix(!sortByMatrix)}
      />

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-2">
          <SortableContext 
            items={planItems.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedDisplayItems.map((item) => (
              <DraggableTask key={item.id} id={item.id}>
                <div className={`relative ${item.isRollover ? 'border-l-4 border-orange-400 pl-2' : ''}`}>
                  {item.isRollover && (
                    <span className="text-[10px] text-orange-500 font-bold uppercase absolute -top-4 left-0">
                      昨日延宕
                    </span>
                  )}
                  {item.refType === 'TASK' ? (
                    <TaskItem task={item.data} />
                  ) : (
                    <div className="border rounded-lg p-3 bg-card flex items-center gap-3">
                       <span className="text-sm italic text-muted-foreground">[子任務]</span>
                       <span className="font-medium">{item.data?.title}</span>
                    </div>
                  )}
                </div>
              </DraggableTask>
            ))}
          </SortableContext>
        </div>
        
        <DragOverlay>
          {activeId ? (
            <div className="border rounded-lg p-3 bg-card shadow-xl opacity-80">
              正在拖曳...
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {displayItems.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl">
          <p className="text-muted-foreground italic">今日尚無計畫項目</p>
          <p className="text-xs text-muted-foreground">從「主題分類」中拖入任務來規劃今天吧！</p>
        </div>
      )}
    </div>
  );
};
