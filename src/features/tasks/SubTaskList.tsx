import React, { useState } from 'react';
import { useSubTask } from '@/hooks/useSubTask';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Pencil, MoreHorizontal, RotateCcw, Infinity as InfinityIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { repository } from '@/lib/repository';
import { type SubTask, type SubTaskType } from '@/lib/db';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMedia } from 'react-use';

interface SubTaskListProps {
  taskId: string;
  viewMode?: 'default' | 'daily-plan';
}

export const SubTaskList: React.FC<SubTaskListProps> = ({ taskId, viewMode = 'default' }) => {
  const { subtasks, createSubTask, updateSubTask } = useSubTask(taskId);
  const [newSubTitle, setNewSubTitle] = useState('');
  const [newSubType, setNewSubType] = useState<SubTaskType>('one-time');
  const [newSubLimit, setNewSubLimit] = useState<number>(1);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState<SubTaskType>('one-time');
  const [editLimit, setEditLimit] = useState<number>(1);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionSubTask, setActionSubTask] = useState<SubTask | null>(null);

  const isDesktop = useMedia("(min-width: 768px)");

  const handleCreate = async () => {
    if (newSubTitle.trim()) {
      await createSubTask(newSubTitle, newSubType, newSubType === 'multi-time' ? newSubLimit : undefined);
      setNewSubTitle('');
      setNewSubType('one-time');
      setNewSubLimit(1);
    }
  };

  const startEdit = (sub: SubTask) => {
    setEditingId(sub.id);
    setEditTitle(sub.title);
    setEditType(sub.type || 'one-time');
    setEditLimit(sub.repeatLimit || 1);
    setActionSubTask(null);
  };

  const saveEdit = async (id: string) => {
    if (editTitle.trim()) {
      await updateSubTask(id, { 
        title: editTitle, 
        type: editType, 
        repeatLimit: editType === 'multi-time' ? editLimit : undefined 
      });
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
        <div className="flex flex-col gap-2 bg-accent/5 p-2 rounded-lg border border-dashed">
          <div className="flex gap-2">
            <Input 
              className="h-8 text-sm flex-1"
              placeholder="新增子任務..." 
              value={newSubTitle}
              onChange={(e) => setNewSubTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button size="sm" className="h-8" variant="outline" onClick={handleCreate}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Select value={newSubType} onValueChange={(val) => setNewSubType(val as SubTaskType)}>
                <SelectTrigger className="h-7 text-[10px] w-[100px]">
                    <SelectValue placeholder="類型" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="one-time">一次性</SelectItem>
                    <SelectItem value="multi-time">多次性</SelectItem>
                    <SelectItem value="daily">每日</SelectItem>
                </SelectContent>
            </Select>

            {newSubType === 'multi-time' && (
                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">次數:</span>
                    <Input 
                        type="number"
                        min={1}
                        className="h-7 w-12 text-[10px] px-1"
                        value={newSubLimit}
                        onChange={(e) => setNewSubLimit(parseInt(e.target.value) || 1)}
                    />
                </div>
            )}
          </div>
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
            editType={editType}
            setEditType={setEditType}
            editLimit={editLimit}
            setEditLimit={setEditLimit}
            onEdit={() => startEdit(sub)}
            onDelete={() => handleDeleteClick(sub)}
            onSave={() => saveEdit(sub.id)}
            onUpdateStatus={(checked) => updateSubTask(sub.id, { isCompleted: checked })}
            onUpdateEisenhower={(val) => repository.subtasks.update(sub.id, { eisenhower: val })}
            openAction={() => !isDesktop && viewMode === 'default' && setActionSubTask(sub)}
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

      <Drawer repositionInputs={false} open={!!actionSubTask} onOpenChange={(open) => !open && setActionSubTask(null)}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>{actionSubTask?.title}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 space-y-2">
              <Button variant="outline" className="w-full justify-start gap-3 h-12 text-base" onClick={() => actionSubTask && startEdit(actionSubTask)}>
                <Pencil className="h-5 w-5" /> 編輯標題與類型
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12 text-base text-destructive hover:text-destructive" onClick={() => actionSubTask && handleDeleteClick(actionSubTask)}>
                <Trash2 className="h-5 w-5" /> 刪除子任務
              </Button>
            </div>
            <div className="h-8" />
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
  editType: SubTaskType;
  setEditType: (val: SubTaskType) => void;
  editLimit: number;
  setEditLimit: (val: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onUpdateStatus: (checked: boolean) => void;
  onUpdateEisenhower: (val: 'Q1' | 'Q2' | 'Q3' | 'Q4') => void;
  openAction: () => void;
}

const SubTaskRow: React.FC<SubTaskRowProps> = ({
  sub, isDesktop, viewMode, editingId, editTitle, setEditTitle, 
  editType, setEditType, editLimit, setEditLimit,
  onEdit, onDelete, onSave, onUpdateStatus, onUpdateEisenhower, openAction
}) => {

  const isEditing = editingId === sub.id;

  return (
    <div 
      className={`flex flex-col gap-1 group active:bg-accent/5 duration-75 rounded p-1 ${isEditing ? 'bg-accent/10 border border-dashed' : ''}`}
    >
      <div className="flex items-center gap-2">
        <Checkbox 
            checked={sub.isCompleted} 
            onCheckedChange={(checked) => onUpdateStatus(!!checked)}
        />
        
        {isEditing && viewMode === 'default' ? (
            <Input 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSave()}
                autoFocus
                className="h-6 text-sm flex-1"
            />
        ) : (
            <div className="flex items-center gap-1 flex-1 truncate">
                <span className={`text-sm truncate ${sub.isCompleted ? 'text-muted-foreground line-through opacity-50' : ''}`}>
                    {sub.title}
                </span>
                {sub.type === 'multi-time' && (
                  <div className="flex items-center gap-1">
                    <RotateCcw className="h-3 w-3 text-orange-400 shrink-0" />
                    <span className={`text-[10px] font-mono ${(sub as any).completedCount > (sub.repeatLimit || 0) ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                      {(sub as any).completedCount || 0}/{sub.repeatLimit}
                    </span>
                  </div>
                )}
                {sub.type === 'daily' && <InfinityIcon className="h-3 w-3 text-blue-400 shrink-0" />}
            </div>
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
            {isDesktop && viewMode === 'default' && !isEditing && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onEdit}>
                    <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={onDelete}>
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
            )}
            {!isDesktop && viewMode === 'default' && !isEditing && (
                <MoreHorizontal className="h-4 w-4 text-muted-foreground opacity-30" onClick={openAction} />
            )}
            {isEditing && (
                <Button size="sm" className="h-6 px-2 text-[10px]" onClick={onSave}>儲存</Button>
            )}
        </div>
      </div>
      
      {isEditing && (
          <div className="flex items-center gap-2 ml-7 mt-1">
              <Select value={editType} onValueChange={(val) => setEditType(val as SubTaskType)}>
                  <SelectTrigger className="h-6 text-[10px] w-[80px]">
                      <SelectValue placeholder="類型" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="one-time">一次性</SelectItem>
                      <SelectItem value="multi-time">多次性</SelectItem>
                      <SelectItem value="daily">每日</SelectItem>
                  </SelectContent>
              </Select>

              {editType === 'multi-time' && (
                  <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">次數:</span>
                      <Input 
                          type="number"
                          min={1}
                          className="h-6 w-10 text-[10px] px-1"
                          value={editLimit}
                          onChange={(e) => setEditLimit(parseInt(e.target.value) || 1)}
                      />
                  </div>
              )}
          </div>
      )}
    </div>
  );
};
