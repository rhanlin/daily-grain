import React from 'react';
import { type Task } from '@/lib/db';
import { useSubTask } from '@/hooks/useSubTask';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { SubTaskList } from './SubTaskList';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Archive } from 'lucide-react';
import { repository } from '@/lib/repository';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { subtasks } = useSubTask(task.id);
  const [isOpen, setIsOpen] = React.useState(false);

  const completedCount = subtasks.filter(s => s.isCompleted).length;
  const totalCount = subtasks.length;

  const isDone = task.status === 'DONE';

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await repository.tasks.update(task.id, { status: 'ARCHIVED' });
  };

  if (task.status === 'ARCHIVED') return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg p-3 bg-card shadow-sm transition-opacity group">
      <div className={`flex items-center gap-3 ${isDone ? 'opacity-50' : ''}`}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        
        <div className="flex-1 flex items-center justify-between">
          <span className={`font-medium ${isDone ? 'line-through' : ''}`}>
            {task.title}
          </span>
          <div className="flex items-center gap-2">
            {totalCount > 0 && (
              <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                {completedCount}/{totalCount}
              </span>
            )}
            <Badge 
              variant={task.eisenhower.toLowerCase() as any}
              className="cursor-pointer hover:brightness-90 transition-all"
              onClick={async (e) => {
                e.stopPropagation();
                const nextValue = repository.utils.cycleEisenhower(task.eisenhower);
                await repository.tasks.update(task.id, { eisenhower: nextValue });
              }}
            >
              {task.eisenhower}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleArchive}
            >
              <Archive className="h-3 w-3 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      <CollapsibleContent>
        <SubTaskList taskId={task.id} />
      </CollapsibleContent>
    </Collapsible>
  );
};

// Simple placeholder for Button if not imported from UI
import { Button } from '@/components/ui/button';
