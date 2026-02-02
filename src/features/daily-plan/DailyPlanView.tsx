import React, { useState, useEffect } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDailyPlan } from '@/hooks/useDailyPlan';
import { PlanToolbar } from './PlanToolbar';
import { DraggableTask } from '@/components/dnd/DraggableTask';
import { TaskItem } from '../tasks/TaskItem';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDroppable } from '@dnd-kit/core';

interface DailyPlanViewProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const DailyPlanView: React.FC<DailyPlanViewProps> = ({ selectedDate, onDateChange }) => {
  const { planItems, triggerRollover } = useDailyPlan(selectedDate);
  const [sortByMatrix, setSortByMatrix] = useState(false);
  
  const { setNodeRef } = useDroppable({
    id: 'daily-plan-dropzone',
  });

  useEffect(() => {
    triggerRollover();
  }, [selectedDate]);

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
        onDateChange={onDateChange} 
        sortByMatrix={sortByMatrix}
        onToggleSort={() => setSortByMatrix(!sortByMatrix)}
      />

      <div ref={setNodeRef} className="space-y-2 min-h-[400px] border-2 border-transparent rounded-xl transition-colors">
        <SortableContext 
          items={planItems.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedDisplayItems.map((item) => (
            <DraggableTask key={item.id} id={item.id}>
              <div className={`relative ${item.isRollover ? 'border-l-4 border-orange-400 pl-2' : ''} bg-background rounded-lg`}>
                {item.isRollover && (
                  <span className="text-[10px] text-orange-500 font-bold uppercase absolute -top-4 left-0">
                    昨日延宕
                  </span>
                )}
                {item.refType === 'TASK' ? (
                  <TaskItem task={item.data} />
                ) : (
                  <div className="border rounded-lg p-3 bg-card flex items-center gap-3 shadow-sm">
                     <span className="text-sm italic text-muted-foreground">[子任務]</span>
                     <span className="font-medium">{item.data?.title}</span>
                     <Badge variant={item.data?.eisenhower?.toLowerCase() as any || 'q4'} className="text-[10px] ml-auto">
                        {item.data?.eisenhower || 'Q4'}
                     </Badge>
                  </div>
                )}
              </div>
            </DraggableTask>
          ))}
        </SortableContext>

        {displayItems.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground italic">今日尚無計畫項目</p>
            <p className="text-xs text-muted-foreground">從左側「待辦清單」中拖入項目來規劃今天吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};

import { Badge } from '@/components/ui/badge';