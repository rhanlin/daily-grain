import React, { useState } from 'react';
import { useSubTask } from '@/hooks/useSubTask';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { repository } from '@/lib/repository';
import { type SubTask } from '@/lib/db';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';

interface SubTaskListProps {
  taskId: string;
  viewMode?: 'default' | 'daily-plan';
}

export const SubTaskList: React.FC<SubTaskListProps> = ({ taskId, viewMode = 'default' }) => {
  const { subtasks, createSubTask, updateSubTask } = useSubTask(taskId);
  const [newSubTitle, setNewSubTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (newSubTitle.trim()) {
      await createSubTask(newSubTitle);
      setNewSubTitle('');
    }
  };

  const startEdit = (sub: SubTask) => {
    setEditingId(sub.id);
    setEditTitle(sub.title);
  };

  const saveEdit = async (id: string) => {
    if (editTitle.trim()) {
      await updateSubTask(id, { title: editTitle });
      setEditingId(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await repository.subtasks.delete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-3 mt-4 ml-4 border-l-2 pl-4">
      {viewMode === 'default' && (
        <div className="flex gap-2">
          <Input 
            size={30}
            className="h-8 text-sm"
            placeholder="新增子任務..." 
            value={newSubTitle}
            onChange={(e) => setNewSubTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <Button size="sm" className="h-8" variant="outline" onClick={handleCreate}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {subtasks.map((sub) => (
          <div key={sub.id} className="flex items-center gap-2 group">
            <Checkbox 
              checked={sub.isCompleted} 
              onCheckedChange={(checked) => updateSubTask(sub.id, { isCompleted: !!checked })}
            />
            
            {editingId === sub.id && viewMode === 'default' ? (
              <Input 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => saveEdit(sub.id)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit(sub.id)}
                autoFocus
                className="h-6 text-sm flex-1"
              />
            ) : (
              <span className={`text-sm flex-1 ${sub.isCompleted ? 'text-muted-foreground line-through opacity-50' : ''}`}>
                {sub.title}
              </span>
            )}

            <div className="flex items-center gap-1">
              <Badge 
                variant={(sub.eisenhower?.toLowerCase() || 'q4') as 'q1' | 'q2' | 'q3' | 'q4'}
                className="cursor-pointer hover:brightness-90 transition-all text-[10px] px-1.5 py-0"
                onClick={async (e) => {
                  e.stopPropagation();
                  const nextValue = repository.utils.cycleEisenhower(sub.eisenhower || 'Q4');
                  await repository.subtasks.update(sub.id, { eisenhower: nextValue });
                }}
              >
                {sub.eisenhower || 'Q4'}
              </Badge>
              {viewMode === 'default' && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => startEdit(sub)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => handleDeleteClick(sub.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>確認刪除子任務？</DialogTitle>
            <DialogDescription>
              此操作無法復原。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>取消</Button>
            <Button variant="destructive" onClick={confirmDelete}>確認刪除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
