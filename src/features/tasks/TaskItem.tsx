import React from 'react';
import { type Task } from '@/lib/db';
import { useSubTask } from '@/hooks/useSubTask';
import { Badge } from '@/components/ui/badge';
import { SubTaskList } from './SubTaskList';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Archive, Pencil, Trash2 } from 'lucide-react';
import { repository } from '@/lib/repository';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';

interface TaskItemProps {
  task: Task;
  viewMode?: 'default' | 'daily-plan';
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, viewMode = 'default' }) => {
  const { subtasks } = useSubTask(task.id);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(task.title);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const completedCount = subtasks.filter(s => s.isCompleted).length;
  const totalCount = subtasks.length;

  const isDone = task.status === 'DONE';

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await repository.tasks.update(task.id, { status: 'ARCHIVED' });
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    await repository.tasks.delete(task.id);
    setIsDeleteDialogOpen(false);
  };

  const saveEdit = async () => {
    if (editTitle.trim()) {
      await repository.tasks.update(task.id, { title: editTitle });
      setIsEditing(false);
    }
  };

  if (task.status === 'ARCHIVED') return null;

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg p-3 bg-card shadow-sm transition-opacity group">
        <div className={`flex items-center gap-3 ${isDone ? 'opacity-50' : ''}`}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          
          <div className="flex-1 flex items-center justify-between">
            {isEditing && viewMode === 'default' ? (
              <Input 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                autoFocus
                className="h-7 text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className={`font-medium ${isDone ? 'line-through' : ''}`}>
                {task.title}
              </span>
            )}
            
            <div className="flex items-center gap-2">
              {totalCount > 0 && (
                <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                  {completedCount}/{totalCount}
                </span>
              )}
              <Badge 
              variant={task.eisenhower.toLowerCase() as 'q1' | 'q2' | 'q3' | 'q4'}
              className="cursor-pointer hover:brightness-90 transition-all"
                onClick={async (e) => {
                  e.stopPropagation();
                  const nextValue = repository.utils.cycleEisenhower(task.eisenhower);
                  await repository.tasks.update(task.id, { eisenhower: nextValue });
                }}
              >
                {task.eisenhower}
              </Badge>
              
              {viewMode === 'default' && (
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                  >
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-destructive"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={handleArchive}
                  >
                    <Archive className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <CollapsibleContent>
          <SubTaskList taskId={task.id} viewMode={viewMode} />
        </CollapsibleContent>
      </Collapsible>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>確認刪除任務？</DialogTitle>
            <DialogDescription>
              確定要刪除 "{task.title}" 嗎？所有子任務也將被刪除。此操作無法復原。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={confirmDelete}>確認刪除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

