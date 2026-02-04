import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Target, Filter } from 'lucide-react';
import { MatrixQuadrant, type MatrixItem } from './MatrixQuadrant';

export const EisenhowerMatrix: React.FC = () => {
  const [viewFilter, setViewFilter] = useState<'ALL' | 'TASK' | 'SUBTASK'>('ALL');
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const allItems = useLiveQuery(async () => {
    const tasks = await db.tasks.where('status').anyOf('TODO', 'DONE').toArray();
    const subtasks = await db.subtasks.toArray();
    const categories = await db.categories.toArray();
    const catMap = new Map(categories.map(c => [c.id, c.color]));
    
    const allTaskIds = new Set(subtasks.map(s => s.taskId));
    const parentTasks = await db.tasks.bulkGet(Array.from(allTaskIds));
    const parentTaskMap = new Map(parentTasks.filter(Boolean).map(t => [t!.id, t!]));

    const matrixTasks: MatrixItem[] = tasks.map(t => ({
      id: t.id,
      title: t.title,
      eisenhower: t.eisenhower,
      type: 'TASK',
      status: t.status,
      categoryColor: catMap.get(t.categoryId)
    }));

    const matrixSubs: MatrixItem[] = subtasks.map(s => {
      const parentTask = parentTaskMap.get(s.taskId);
      return {
        id: s.id,
        title: s.title,
        eisenhower: s.eisenhower || 'Q4',
        type: 'SUBTASK',
        parentId: s.taskId,
        isCompleted: s.isCompleted,
        categoryColor: parentTask ? catMap.get(parentTask.categoryId) : undefined
      };
    });

    return [...matrixTasks, ...matrixSubs];
  });

  const items = allItems || [];
  
  const filteredItems = items.filter(item => {
    if (viewFilter === 'TASK') return item.type === 'TASK';
    if (viewFilter === 'SUBTASK') return item.type === 'SUBTASK';
    return true;
  });

  const getQuadrantItems = (q: string) => filteredItems.filter(i => i.eisenhower === q);

  return (
    <div className="relative w-full h-[calc(100dvh-130px)] md:h-auto md:flex-1 flex flex-col pt-1 pb-4 min-h-0">
      {/* Interaction Hint: Micro-watermark */}
      <div className="absolute bottom-0 right-2 flex items-center gap-1 text-[8px] text-muted-foreground/40 pointer-events-none z-10 select-none">
        <Target className="h-2 w-2" />
        <span>點擊任務鎖定關聯</span>
      </div>

      <div className="flex-1 flex gap-0 min-h-0">
        {/* Y-Axis Label: 重要度 (Importance) - No padding, edge-to-edge */}
        <div className="flex flex-row justify-around text-[10px] font-bold text-muted-foreground/50 uppercase [writing-mode:vertical-lr] pr-2 select-none">
          <span className="text-center">重要</span>
          <span className="text-center">不重要</span>
        </div>

        <div className="flex-1 flex flex-col gap-0 min-h-0">

          {/* X-Axis Label: 緊急度 (Urgency) */}
          <div className="flex justify-around text-[10px] font-bold text-muted-foreground/50 uppercase px-4 py-1 select-none">
            <span className="text-center">緊急</span>
            <span className="text-center">不緊急</span>
          </div>

          <div className="grid grid-cols-2 grid-rows-2 gap-px bg-border border-y sm:border-x sm:rounded-xl overflow-hidden flex-1 min-h-0 shadow-sm">
            <MatrixQuadrant 
              quadrant="Q1"
              items={getQuadrantItems('Q1')} 
              focusedId={focusedId}
              onFocus={setFocusedId}
            />
            <MatrixQuadrant 
              quadrant="Q2"
              items={getQuadrantItems('Q2')} 
              focusedId={focusedId}
              onFocus={setFocusedId}
            />
            <MatrixQuadrant 
              quadrant="Q3"
              items={getQuadrantItems('Q3')} 
              focusedId={focusedId}
              onFocus={setFocusedId}
            />
            <MatrixQuadrant 
              quadrant="Q4"
              items={getQuadrantItems('Q4')} 
              focusedId={focusedId}
              onFocus={setFocusedId}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button for Filter */}
      <div className="fixed bottom-24 right-6 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="rounded-full h-12 w-12 shadow-xl border-2 border-background">
              <Filter className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => setViewFilter('ALL')} className={viewFilter === 'ALL' ? 'bg-accent' : ''}>
              全部
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setViewFilter('TASK')} className={viewFilter === 'TASK' ? 'bg-accent' : ''}>
              僅任務
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setViewFilter('SUBTASK')} className={viewFilter === 'SUBTASK' ? 'bg-accent' : ''}>
              僅子任務
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
