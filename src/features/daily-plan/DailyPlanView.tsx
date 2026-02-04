import React, { useState, useEffect } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDailyPlan } from '@/hooks/useDailyPlan';
import { PlanToolbar } from './PlanToolbar';
import { DraggableTask } from '@/components/dnd/DraggableTask';
import { TaskItem } from '../tasks/TaskItem';
import { db, type Task } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDroppable } from '@dnd-kit/core';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useLongPress, useMedia } from 'react-use';
import { getLocalToday } from '@/lib/utils';

interface DailyPlanViewProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const DailyPlanView: React.FC<DailyPlanViewProps> = ({ selectedDate, onDateChange }) => {
  const { planItems, triggerRollover, removeFromPlan } = useDailyPlan(selectedDate);
  const [sortByMatrix, setSortByMatrix] = useState(false);
  const [actionItem, setActionItem] = useState<any | null>(null);

  const isDesktop = useMedia("(min-width: 768px)");
  
  const { setNodeRef } = useDroppable({
    id: 'daily-plan-dropzone',
  });

  useEffect(() => {
    const today = getLocalToday();
    if (selectedDate === today) {
      triggerRollover();
    }
  }, [selectedDate, triggerRollover]);

  // We need the actual Task/Subtask objects to render
  const resolvedItems = useLiveQuery(async () => {
    const results = [];
    for (const item of planItems) {
      let data;
      let parentTask;
      if (item.refType === 'TASK') {
        data = await db.tasks.get(item.refId);
      } else {
        data = await db.subtasks.get(item.refId);
        if (data) {
          parentTask = await db.tasks.get(data.taskId);
        }
      }
      results.push({ ...item, data, parentTask });
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

  const handleRemove = (id: string) => {
    removeFromPlan(id);
    setActionItem(null);
  };

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
            <PlanItemWrapper 
              key={item.id} 
              item={item} 
              isDesktop={isDesktop} 
              onRemove={() => handleRemove(item.id)}
              onLongPress={() => !isDesktop && setActionItem(item)}
            />
          ))}
        </SortableContext>

        {displayItems.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground italic">今日尚無計畫項目</p>
            <p className="text-xs text-muted-foreground">{`從${isDesktop ? '左側' : '底部'}`}「待辦清單」中拖入項目來規劃今天吧！</p>
          </div>
        )}
      </div>

      <Drawer open={!!actionItem} onOpenChange={(open) => !open && setActionItem(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{actionItem?.data?.title}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2 text-destructive" onClick={() => handleRemove(actionItem.id)}>
              <Trash2 className="h-4 w-4" /> 從今日計畫移除
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

const PlanItemWrapper: React.FC<{ item: any, isDesktop: boolean, onRemove: () => void, onLongPress: () => void }> = ({ item, isDesktop, onRemove, onLongPress }) => {
  const onLongPressHandler = useLongPress((e) => {
    if (e && 'defaultPrevented' in e && e.defaultPrevented) return;

    if (e) {
      if ('preventDefault' in e) e.preventDefault();
      if ('stopPropagation' in e) e.stopPropagation();
    }
    onLongPress();
  }, {
    delay: 500,
    isPreventDefault: false,
  });

  return (
    <DraggableTask id={item.id}>
      <div 
        {...(isDesktop ? {} : onLongPressHandler)}
        className={`relative ${item.isRollover ? 'border-l-4 border-orange-400 pl-2' : ''} bg-background rounded-lg group active:bg-accent/5 duration-75`}
      >
        {item.isRollover && (
          <span className="text-[10px] text-orange-500 font-bold uppercase absolute -top-4 left-0">
            昨日延宕
          </span>
        )}
        
        {isDesktop && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-sm"
            onPointerDown={(e) => { e.stopPropagation(); onRemove(); }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        {item.refType === 'TASK' && item.data ? (
          <TaskItem task={item.data as Task} viewMode="daily-plan" />
        ) : (
          <PlanSubTaskItem item={item} />
        )}
      </div>
    </DraggableTask>
  );
};

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useSubTask } from '@/hooks/useSubTask';

// New component specifically for rendering a sub-task within the daily plan
const PlanSubTaskItem: React.FC<{ item: any }> = ({ item }) => {
  const { updateSubTask } = useSubTask(item.parentTask?.id);

  if (!item.data || !item.parentTask) {
    return null; // Or a loading/error state
  }
  
  const handleCheckedChange = (checked: boolean) => {
    updateSubTask(item.data.id, { isCompleted: checked });
  };

  return (
    <div className={`border rounded-lg p-3 bg-card flex items-center gap-2 shadow-sm text-sm transition-opacity ${item.data.isCompleted ? 'opacity-40' : ''}`}>
      <Checkbox
        checked={item.data.isCompleted}
        onCheckedChange={handleCheckedChange}
        onClick={(e) => e.stopPropagation()}
      />
      <span className="font-semibold text-muted-foreground truncate">{item.parentTask?.title}</span>
      <span className="text-muted-foreground">/</span>
      <span className={`font-medium flex-1 truncate ${item.data.isCompleted ? 'line-through' : ''}`}>{item.data?.title}</span>
      <Badge variant={(item.data?.eisenhower?.toLowerCase() || 'q4') as 'q1' | 'q2' | 'q3' | 'q4'} className="text-[10px] ml-auto">
          {item.data?.eisenhower || 'Q4'}
      </Badge>
    </div>
  );
};