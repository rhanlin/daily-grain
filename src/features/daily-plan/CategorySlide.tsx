import React from 'react';
import { type Category, type Task, type SubTask } from '@/lib/db';
import { CalendarIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useDraggable } from '@dnd-kit/core';

interface CategorySlideProps {
  category: Category;
  tasks: Task[];
  subtasks: SubTask[];
  planRefIds: Set<string>;
  scheduledMap: Map<string, string>;
  isDesktop: boolean;
  onItemTap: (refId: string, refType: 'TASK' | 'SUBTASK') => void;
}

export const CategorySlide: React.FC<CategorySlideProps> = ({
  category,
  tasks,
  subtasks,
  planRefIds,
  scheduledMap,
  isDesktop,
  onItemTap,
}) => {
  return (
    <div className="space-y-3 h-full">
      <div className="flex items-center gap-2 px-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
        <h3 className="font-bold text-xs uppercase text-muted-foreground truncate">{category.name}</h3>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <BacklogTaskItem 
            key={task.id} 
            task={task} 
            subtasks={subtasks.filter(s => s.taskId === task.id)}
            planRefIds={planRefIds} 
            scheduledMap={scheduledMap} 
            isDesktop={isDesktop}
            onItemTap={onItemTap}
          />
        ))}
      </div>
    </div>
  );
};

const BacklogTaskItem = ({ task, subtasks, planRefIds, scheduledMap, isDesktop, onItemTap }: { 
  task: any, 
  subtasks: SubTask[],
  planRefIds: Set<string>, 
  scheduledMap: Map<string, string>, 
  isDesktop: boolean, 
  onItemTap: (refId: string, refType: 'TASK' | 'SUBTASK') => void 
}) => {
  if (subtasks.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="space-y-2 border rounded-md p-2 bg-secondary/10">
        <p className="text-[10px] font-bold text-muted-foreground/70 uppercase px-1 truncate">{task.title}</p>
        {subtasks.map(sub => {
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
                  <Badge variant={(sub.eisenhower?.toLowerCase() || 'q4') as any} className="text-[8px] px-1 py-0 h-4">
                    {sub.eisenhower || 'Q4'}
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
