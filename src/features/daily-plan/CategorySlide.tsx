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
  scheduledMap: Map<string, string>;
  isDesktop: boolean;
  onItemTap: (refId: string, refType: 'TASK' | 'SUBTASK') => void;
}

export const CategorySlide: React.FC<CategorySlideProps> = ({
  category,
  tasks,
  subtasks,
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
          />
        ))}
        
        {/* Render subtasks whose parent tasks might NOT be in the backlog tasks list (e.g. parent task is archived or scheduled) */}
        {/* But they must belong to this category */}
        {subtasks
          .filter(s => !tasks.some(t => t.id === s.taskId))
          .map(sub => {
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

const BacklogTaskItem = ({ task, subtasks, scheduledMap, isDesktop, onItemTap }: { 
  task: Task, 
  subtasks: SubTask[],
  scheduledMap: Map<string, string>, 
  isDesktop: boolean, 
  onItemTap: (refId: string, refType: 'TASK' | 'SUBTASK') => void 
}) => {
  const scheduledDate = scheduledMap.get(task.id);

  return (
    <div className="space-y-2 border rounded-md p-2 bg-secondary/10">
      <DraggableItem 
        id={task.id} 
        data={{ type: 'BACKLOG_ITEM', refId: task.id, refType: 'TASK' }}
        isDesktop={isDesktop}
        onItemTap={() => onItemTap(task.id, 'TASK')}
      >
        <div className="flex justify-between items-center px-1 mb-1">
          <p className={`text-[10px] font-bold text-muted-foreground/70 uppercase truncate flex-1 ${isDesktop ? 'cursor-grab active:cursor-grabbing' : ''}`}>
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