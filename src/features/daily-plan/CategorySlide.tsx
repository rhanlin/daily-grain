import React from 'react';
import { type Category, type Task, type SubTask } from '@/lib/db';
import { CalendarIcon, Infinity as InfinityIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useDraggable } from '@dnd-kit/core';
import { useLongPress } from 'react-use';

import { Checkbox } from '@/components/ui/checkbox';

interface CategorySlideProps {
  category: Category;
  tasks: Task[];
  subtasks: SubTask[];
  scheduledMap: Map<string, string>;
  isDesktop: boolean;
  onItemTap: (refId: string, refType: 'TASK' | 'SUBTASK') => void;
  // Selection Props
  isSelectionMode?: boolean;
  selectedIds?: Set<string>;
  activeCategoryId?: string | null;
  onToggleSelection?: (subTaskId: string, categoryId: string) => void;
  onStartSelection?: (subTaskId: string, categoryId: string) => void;
}

export const CategorySlide: React.FC<CategorySlideProps> = ({
  category,
  tasks,
  subtasks,
  scheduledMap,
  isDesktop,
  onItemTap,
  isSelectionMode = false,
  selectedIds = new Set(),
  activeCategoryId = null,
  onToggleSelection,
  onStartSelection,
}) => {
  // FR-003: Lock slides from different categories
  const isLocked = isSelectionMode && activeCategoryId !== category.id;

  return (
    <div className={`space-y-3 h-full transition-all duration-300 ${isLocked ? 'opacity-30 grayscale pointer-events-none' : ''} ${isSelectionMode ? 'pb-24' : 'pb-4'}`}>
      <div className="flex items-center gap-2 px-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
        <h3 className="font-bold text-xs uppercase text-muted-foreground truncate">{category.name}</h3>
      </div>
      <div className="space-y-4">
        {/* Render tasks that are directly in the category backlog */}
        {tasks.map((task) => (
          <BacklogTaskItem 
            key={task.id} 
            task={task} 
            subtasks={subtasks.filter(s => s.taskId === task.id)}
            scheduledMap={scheduledMap} 
            isDesktop={isDesktop}
            onItemTap={onItemTap}
            isSelectionMode={isSelectionMode}
            selectedIds={selectedIds}
            activeCategoryId={activeCategoryId}
            onToggleSelection={onToggleSelection}
            onStartSelection={onStartSelection}
            categoryId={category.id}
          />
        ))}
        
        {/* Render subtasks whose parent tasks might NOT be in the backlog tasks list (e.g. parent task is archived or scheduled) */}
        {/* But they must belong to this category */}
        {subtasks
          .filter(s => !tasks.some(t => t.id === s.taskId))
          .map(sub => {
            const scheduledDate = scheduledMap.get(sub.id);
            const isSelected = selectedIds.has(sub.id);

            return (
              <DraggableItem 
                key={sub.id} 
                id={sub.id} 
                data={{ type: 'BACKLOG_ITEM', refId: sub.id, refType: 'SUBTASK' }}
                isDesktop={isDesktop}
                onItemTap={() => {
                  if (isSelectionMode) {
                    onToggleSelection?.(sub.id, category.id);
                  } else {
                    onItemTap(sub.id, 'SUBTASK');
                  }
                }}
                onLongPress={() => onStartSelection?.(sub.id, category.id)}
                isSelected={isSelected}
              >
                <div className={`p-2 bg-card border rounded shadow-sm text-sm flex justify-between items-center group transition-all ${isSelected ? 'ring-2 ring-primary border-primary' : ''} ${isDesktop ? 'cursor-grab active:cursor-grabbing' : ''}`}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isSelectionMode && (
                      <Checkbox checked={isSelected} className="rounded-full" />
                    )}
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span className='truncate'>{sub.title}</span>
                      {sub.type === 'multi-time' && (
                        <span className={`text-[10px] font-mono shrink-0 ${(sub as any).completedCount > (sub.repeatLimit || 0) ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                          ({(sub as any).completedCount || 0}/{sub.repeatLimit})
                        </span>
                      )}
                      {sub.type === 'daily' && <InfinityIcon className="h-3 w-3 text-blue-400 shrink-0" />}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    {scheduledDate && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger onClick={(e) => e.stopPropagation()}>
                            <CalendarIcon className='h-3 w-3 text-muted-foreground' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>已排程於 {scheduledDate}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <Badge variant={(sub.eisenhower?.toLowerCase() || 'q4') as any} className="text-[8px] px-1 py-0 h-4">
                      {sub.eisenhower || 'Q4'}
                    </Badge>
                  </div>
                </div>
              </DraggableItem>
            );
          })
        }
      </div>
    </div>
  );
};

const BacklogTaskItem = ({ 
  task, 
  subtasks, 
  scheduledMap, 
  isDesktop, 
  onItemTap,
  isSelectionMode,
  selectedIds,
  onToggleSelection,
  onStartSelection,
  categoryId
}: { 
  task: Task, 
  subtasks: SubTask[],
  scheduledMap: Map<string, string>, 
  isDesktop: boolean, 
  onItemTap: (refId: string, refType: 'TASK' | 'SUBTASK') => void,
  isSelectionMode: boolean,
  selectedIds: Set<string>,
  activeCategoryId: string | null,
  onToggleSelection?: (subTaskId: string, categoryId: string) => void,
  onStartSelection?: (subTaskId: string, categoryId: string) => void,
  categoryId: string
}) => {
  const scheduledDate = scheduledMap.get(task.id);

  return (
    <div className="space-y-2 border rounded-md p-2 bg-secondary/10 transition-opacity">
      {/* FR-001: Task header is now non-interactive (disabled: true) */}
      <DraggableItem 
        id={task.id} 
        data={{ type: 'BACKLOG_ITEM', refId: task.id, refType: 'TASK' }}
        isDesktop={isDesktop}
        onItemTap={() => {}} // FR-007: Disable click-to-add for Task headers
      >
        <div className="flex justify-between items-center px-1 mb-1">
          <p className="text-[10px] font-bold text-muted-foreground/70 uppercase truncate flex-1">
            {task.title}
          </p>
          <div className="flex items-center gap-2 ml-2">
            {scheduledDate && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={(e) => e.stopPropagation()}>
                    <CalendarIcon className='h-3 w-3 text-muted-foreground' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>已排程於 {scheduledDate}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Badge variant={(task.eisenhower?.toLowerCase() || 'q4') as any} className="text-[8px] px-1 py-0 h-4 scale-90">
              {task.eisenhower || 'Q4'}
            </Badge>
          </div>
        </div>
      </DraggableItem>

      {subtasks.length > 0 && (
        <div className="space-y-2 ml-2 border-l-2 pl-2">
          {subtasks.map(sub => {
            const subScheduledDate = scheduledMap.get(sub.id);
            const isSelected = selectedIds.has(sub.id);

            return (
              <DraggableItem 
                key={sub.id} 
                id={sub.id} 
                data={{ type: 'BACKLOG_ITEM', refId: sub.id, refType: 'SUBTASK' }}
                isDesktop={isDesktop}
                onItemTap={() => {
                  if (isSelectionMode) {
                    onToggleSelection?.(sub.id, categoryId);
                  } else {
                    onItemTap(sub.id, 'SUBTASK');
                  }
                }}
                onLongPress={() => onStartSelection?.(sub.id, categoryId)}
                isSelected={isSelected}
              >
                <div className={`p-2 bg-card border rounded shadow-sm text-sm flex justify-between items-center group transition-all ${isSelected ? 'ring-2 ring-primary border-primary' : ''} ${isDesktop ? 'cursor-grab active:cursor-grabbing' : ''}`}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isSelectionMode && (
                      <Checkbox checked={isSelected} className="rounded-full" />
                    )}
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span className='truncate'>{sub.title}</span>
                      {sub.type === 'multi-time' && (
                        <span className={`text-[10px] font-mono shrink-0 ${(sub as any).completedCount > (sub.repeatLimit || 0) ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                          ({(sub as any).completedCount || 0}/{sub.repeatLimit})
                        </span>
                      )}
                      {sub.type === 'daily' && <InfinityIcon className="h-3 w-3 text-blue-400 shrink-0" />}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    {subScheduledDate && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger onClick={(e) => e.stopPropagation()}>
                            <CalendarIcon className='h-3 w-3 text-muted-foreground' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>已排程於 {subScheduledDate}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <Badge variant={(sub.eisenhower?.toLowerCase() || 'q4') as any} className="text-[8px] px-1 py-0 h-4">
                      {sub.eisenhower || 'Q4'}
                    </Badge>
                  </div>
                </div>
              </DraggableItem>
            );
          })}
        </div>
      )}
    </div>
  );
};

const DraggableItem = ({ 
  id, 
  data, 
  children, 
  isDesktop, 
  onItemTap, 
  onLongPress, 
  isSelected,
  className 
}: { 
  id: string, 
  data: any, 
  children: React.ReactNode, 
  isDesktop: boolean, 
  onItemTap: () => void,
  onLongPress?: () => void,
  isSelected?: boolean,
  className?: string
}) => {
  // T006: Set disabled: true when refType is 'TASK'
  const isDisabled = data.refType === 'TASK';

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data,
    disabled: !isDesktop || isDisabled || isSelected, // Disable drag if selected or mobile/task
  });
  
  const style = transform && isDesktop && !isDisabled ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  // Track pointer movement to distinguish tap from scroll
  const startPosRef = React.useRef({ x: 0, y: 0 });
  const isMovingRef = React.useRef(false);

  // FR-001: Integration of useLongPress for mobile selection
  const longPress = useLongPress(() => {
    if (!isDesktop && !isDisabled && !isMovingRef.current) {
      onLongPress?.();
    }
  }, {
    delay: 500,
    isPreventDefault: false,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    startPosRef.current = { x: e.clientX, y: e.clientY };
    isMovingRef.current = false;
    
    if (!isDesktop && !isDisabled) {
      longPress.onMouseDown(e as any);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const dist = Math.sqrt(
      Math.pow(e.clientX - startPosRef.current.x, 2) + 
      Math.pow(e.clientY - startPosRef.current.y, 2)
    );
    if (dist > 10) {
      isMovingRef.current = true;
    }
  };

  const handlePointerUp = () => {
    if (!isDesktop && !isDisabled) {
      longPress.onMouseUp();
    }

    if (!isMovingRef.current) {
      onItemTap();
    }
  };

  // FR-007: onItemTap will be empty for TASK headers, preventing any action
  const eventHandlers = (isDesktop && !isDisabled) ? listeners : { 
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...eventHandlers} 
      className={`${isDragging ? 'opacity-50' : ''} ${className || ''}`}
    >
      {children}
    </div>
  );
};
