import React, { useState } from 'react';
import { useSubTask } from '@/hooks/useSubTask';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { repository } from '@/lib/repository';

interface SubTaskListProps {
  taskId: string;
}

export const SubTaskList: React.FC<SubTaskListProps> = ({ taskId }) => {
  const { subtasks, createSubTask, updateSubTask } = useSubTask(taskId);
  const [newSubTitle, setNewSubTitle] = useState('');

  const handleCreate = async () => {
    if (newSubTitle.trim()) {
      await createSubTask(newSubTitle);
      setNewSubTitle('');
    }
  };

  return (
    <div className="space-y-3 mt-4 ml-4 border-l-2 pl-4">
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

      <div className="space-y-2">
        {subtasks.map((sub) => (
          <div key={sub.id} className="flex items-center gap-2 group">
            <Checkbox 
              checked={sub.isCompleted} 
              onCheckedChange={(checked) => updateSubTask(sub.id, { isCompleted: !!checked })}
            />
            <span className={`text-sm flex-1 ${sub.isCompleted ? 'text-muted-foreground line-through opacity-50' : ''}`}>
              {sub.title}
            </span>
            <Badge 
              variant={sub.eisenhower?.toLowerCase() as any || 'q4'}
              className="cursor-pointer hover:brightness-90 transition-all text-[10px] px-1.5 py-0"
              onClick={async (e) => {
                e.stopPropagation();
                const nextValue = repository.utils.cycleEisenhower(sub.eisenhower || 'Q4');
                await repository.subtasks.update(sub.id, { eisenhower: nextValue });
              }}
            >
              {sub.eisenhower || 'Q4'}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
