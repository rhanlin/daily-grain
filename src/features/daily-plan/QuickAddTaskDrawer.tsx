import React, { useState, useEffect, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Task } from '@/lib/db';
import { repository } from '@/lib/repository';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';

interface QuickAddTaskDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: string;
}

export const QuickAddTaskDrawer: React.FC<QuickAddTaskDrawerProps> = ({
  open,
  onOpenChange,
  selectedDate,
}) => {
  const [title, setTitle] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [isContinuous, setIsContinuous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all active categories
  const categoriesRaw = useLiveQuery(() => 
    db.categories.filter(c => !c.isArchived).sortBy('orderIndex')
  );
  const categories = useMemo(() => categoriesRaw || [], [categoriesRaw]);

  // Fetch tasks for selected category
  const tasksRaw = useLiveQuery<Task[]>(() => {
    if (!selectedCategoryId) return Promise.resolve([]);
    return db.tasks
      .where('categoryId').equals(selectedCategoryId)
      .filter(t => t.status !== 'ARCHIVED')
      .toArray();
  }, [selectedCategoryId]);
  const tasks = useMemo(() => tasksRaw || [], [tasksRaw]);

  // Auto-select first category and its first task if none selected
  useEffect(() => {
    if (open && categories.length > 0 && !selectedCategoryId) {
      // Try to find the most recent task first
      const setDefaults = async () => {
        const lastTask = await db.tasks.orderBy('updatedAt').reverse().first();
        if (lastTask) {
          setSelectedCategoryId(lastTask.categoryId);
          setSelectedTaskId(lastTask.id);
        } else {
          setSelectedCategoryId(categories[0].id);
        }
      };
      setDefaults();
    }
  }, [open, categories, selectedCategoryId]);

  // When category changes, if current taskId is not in new category, reset or pick first
  useEffect(() => {
    if (tasks.length > 0) {
      if (!selectedTaskId || !tasks.find(t => t.id === selectedTaskId)) {
        setSelectedTaskId(tasks[0].id);
      }
    } else {
      setSelectedTaskId('');
    }
  }, [tasks, selectedTaskId]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim()) {
      toast.error('請輸入任務名稱');
      return;
    }

    setIsSubmitting(true);
    try {
      // T012: Duplicate detection (last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const duplicate = await db.subtasks
        .where('title').equals(title.trim())
        .filter(s => s.createdAt >= fiveMinutesAgo)
        .first();

      if (duplicate) {
        toast.info('提醒：剛才已新增過相同名稱的任務');
      }

      await repository.subtasks.quickCreate(
        title.trim(),
        selectedDate,
        'one-time',
        selectedTaskId || undefined
      );

      toast.success('已新增任務');
      
      if (isContinuous) {
        setTitle('');
        // Keep drawer open
      } else {
        onOpenChange(false);
        setTitle('');
      }

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch (err) {
      console.error(err);
      toast.error('新增失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-sm p-4 space-y-6">
          <DrawerHeader className="px-0">
            <DrawerTitle>快捷新增任務</DrawerTitle>
          </DrawerHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">任務名稱</Label>
              <Input
                id="title"
                placeholder="想要做什麼？"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>分類</Label>
                <Select 
                  value={selectedCategoryId} 
                  onValueChange={setSelectedCategoryId}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇分類" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                          {c.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>主任務</Label>
                <Select 
                  value={selectedTaskId} 
                  onValueChange={setSelectedTaskId}
                  disabled={isSubmitting || !selectedCategoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇任務" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map(t => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title}
                      </SelectItem>
                    ))}
                    {tasks.length === 0 && (
                      <div className="p-2 text-xs text-muted-foreground italic">
                        無可用主任務
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="continuous">連續新增模式</Label>
                <p className="text-[10px] text-muted-foreground">新增後不關閉視窗</p>
              </div>
              <Switch
                id="continuous"
                checked={isContinuous}
                onCheckedChange={setIsContinuous}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DrawerFooter className="px-0 pt-2 pb-6">
            <Button type="submit" disabled={isSubmitting || !title.trim()} className="w-full">
              {isSubmitting ? '處理中...' : '新增任務'}
            </Button>
            <DrawerClose asChild>
              <Button variant="ghost">取消</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
