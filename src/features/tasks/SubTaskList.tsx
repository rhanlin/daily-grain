import React, { useState } from 'react';
import { useSubTask } from '@/hooks/useSubTask';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Pencil, MoreHorizontal } from 'lucide-react';
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useLongPress, useMedia } from 'react-use';

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
  const [actionSubTask, setActionSubTask] = useState<SubTask | null>(null);

  const isDesktop = useMedia("(min-width: 768px)");

  const handleCreate = async () => {
    if (newSubTitle.trim()) {
      await createSubTask(newSubTitle);
      setNewSubTitle('');
    }
  };

  const startEdit = (sub: SubTask) => {
    setEditingId(sub.id);
    setEditTitle(sub.title);
    setActionSubTask(null);
  };

  const saveEdit = async (id: string) => {
    if (editTitle.trim()) {
      await updateSubTask(id, { title: editTitle });
      setEditingId(null);
    }
  };

  const handleDeleteClick = (sub: SubTask) => {
    setDeleteId(sub.id);
    setActionSubTask(null);
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
          <SubTaskRow 
            key={sub.id} 
            sub={sub} 
            isDesktop={isDesktop} 
            viewMode={viewMode}
            editingId={editingId}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            onEdit={() => startEdit(sub)}
            onDelete={() => handleDeleteClick(sub)}
            onSave={() => saveEdit(sub.id)}
            onUpdateStatus={(checked) => updateSubTask(sub.id, { isCompleted: checked })}
            onUpdateEisenhower={(val) => repository.subtasks.update(sub.id, { eisenhower: val })}
            onLongPress={() => !isDesktop && viewMode === 'default' && setActionSubTask(sub)}
          />
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

      <Drawer open={!!actionSubTask} onOpenChange={(open) => !open && setActionSubTask(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{actionSubTask?.title}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => actionSubTask && startEdit(actionSubTask)}>
              <Pencil className="h-4 w-4" /> 編輯標題
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 text-destructive" onClick={() => actionSubTask && handleDeleteClick(actionSubTask)}>
              <Trash2 className="h-4 w-4" /> 刪除子任務
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

interface SubTaskRowProps {
  sub: SubTask;
  isDesktop: boolean;
  viewMode: 'default' | 'daily-plan';
  editingId: string | null;
  editTitle: string;
  setEditTitle: (val: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onUpdateStatus: (checked: boolean) => void;
  onUpdateEisenhower: (val: 'Q1' | 'Q2' | 'Q3' | 'Q4') => void;
  onLongPress: () => void;
}

const SubTaskRow: React.FC<SubTaskRowProps> = ({
  sub, isDesktop, viewMode, editingId, editTitle, setEditTitle, onEdit, onDelete, onSave, onUpdateStatus, onUpdateEisenhower, onLongPress
}) => {
  const onLongPressHandler = useLongPress((e) => {
    // Prevent event from bubbling up to the TaskItem
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
    <div 
      {...(isDesktop ? {} : onLongPressHandler)}
      className="flex items-center gap-2 group active:bg-accent/5 duration-75 rounded"
    >
      <Checkbox 
        checked={sub.isCompleted} 
        onCheckedChange={(checked) => onUpdateStatus(!!checked)}
      />
      
      {editingId === sub.id && viewMode === 'default' ? (
        <Input 
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={onSave}
          onKeyDown={(e) => e.key === 'Enter' && onSave()}
          autoFocus
          className="h-6 text-sm flex-1"
        />
      ) : (
        <span className={`text-sm flex-1 truncate ${sub.isCompleted ? 'text-muted-foreground line-through opacity-50' : ''}`}>
          {sub.title}
        </span>
      )}

      <div className="flex items-center gap-1 flex-shrink-0">
        <Badge 
          variant={(sub.eisenhower?.toLowerCase() || 'q4') as 'q1' | 'q2' | 'q3' | 'q4'}
          className="cursor-pointer hover:brightness-90 transition-all text-[10px] px-1.5 py-0"
          onClick={async (e) => {
            e.stopPropagation();
            const nextValue = repository.utils.cycleEisenhower(sub.eisenhower || 'Q4');
            onUpdateEisenhower(nextValue);
          }}
        >
          {sub.eisenhower || 'Q4'}
        </Badge>
        {isDesktop && viewMode === 'default' && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onEdit}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={onDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
        {!isDesktop && viewMode === 'default' && (
          <MoreHorizontal className="h-4 w-4 text-muted-foreground opacity-30" />
        )}
      </div>
    </div>
  );
};
