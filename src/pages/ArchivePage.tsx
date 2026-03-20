import React, { useState, useEffect } from 'react';
import { useArchive } from '@/hooks/useArchive';
import { repository } from '@/lib/repository';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArchiveRestore, Trash2, Folder, Target, CheckCircle2, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { db, type Category, type Task, type SubTask } from '@/lib/db';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ArchivePage: React.FC = () => {
  const navigate = useNavigate();
  const { archivedData, loading } = useArchive();
  const [deleteConfirm, setDeleteId] = useState<{ id: string, type: 'CAT' | 'TASK' | 'SUB' } | null>(null);
  
  // US2 Context: Store parent data for display
  const [parentData, setParentData] = useState<{ 
    categories: Record<string, Category>, 
    tasks: Record<string, Task> 
  }>({ categories: {}, tasks: {} });

  useEffect(() => {
    const fetchParents = async () => {
      const allCats = await db.categories.toArray();
      const allTasks = await db.tasks.toArray();
      
      const catMap: Record<string, Category> = {};
      allCats.forEach(c => catMap[c.id] = c);
      
      const taskMap: Record<string, Task> = {};
      allTasks.forEach(t => taskMap[t.id] = t);
      
      setParentData({ categories: catMap, tasks: taskMap });
    };
    fetchParents();
  }, [archivedData]);

  const handleRestoreCategory = async (cat: Category) => {
    await db.categories.update(cat.id, { isArchived: false, updatedAt: new Date().toISOString() });
    toast.success(`已還原分類: ${cat.name}`);
  };

  const handleRestoreTask = async (task: Task) => {
    const parentCat = await db.categories.get(task.categoryId);
    if (!parentCat || parentCat.isArchived) {
      toast.error('無法還原任務', { description: `所屬分類「${parentCat?.name || '未知'}」目前處於封存狀態，請先還原分類。` });
      return;
    }
    await repository.tasks.update(task.id, { status: 'TODO' });
    toast.success(`已還原任務: ${task.title}`);
  };

  const handleRestoreSubTask = async (sub: SubTask) => {
    const parentTask = await db.tasks.get(sub.taskId);
    if (!parentTask || parentTask.status === 'ARCHIVED') {
      toast.error('無法還原子任務', { description: `所屬主任務「${parentTask?.title || '未知'}」目前處於封存狀態，請先還原主任務。` });
      return;
    }
    await repository.subtasks.update(sub.id, { isArchived: false });
    toast.success(`已還原子任務: ${sub.title}`);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const { id, type } = deleteConfirm;
    try {
      if (type === 'CAT') {
        const tasks = await db.tasks.where('categoryId').equals(id).toArray();
        if (tasks.length > 0) {
            toast.error('無法永久刪除', { description: '該分類下仍有任務，請先刪除任務。' });
            setDeleteId(null);
            return;
        }
        await db.categories.delete(id);
      }
      if (type === 'TASK') await repository.tasks.delete(id);
      if (type === 'SUB') await repository.subtasks.delete(id);
      toast.success('項目已永久刪除');
    } catch {
      toast.error('刪除失敗');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">載入中...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">封存中心</h1>
          <p className="text-sm text-muted-foreground">管理並還原已封存的項目。</p>
        </div>
      </header>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="categories" className='gap-2 text-xs'>
            <Folder className="h-3.5 w-3.5" /> 分類 ({archivedData.categories.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" className='gap-2 text-xs'>
            <Target className="h-3.5 w-3.5" /> 任務 ({archivedData.tasks.length})
          </TabsTrigger>
          <TabsTrigger value="subtasks" className='gap-2 text-xs'>
            <CheckCircle2 className="h-3.5 w-3.5" /> 子任務 ({archivedData.subtasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-3">
          {archivedData.categories.length === 0 && <EmptyState text="無封存分類" />}
          {archivedData.categories.map(cat => (
            <ArchiveItem 
              key={cat.id} 
              title={cat.name} 
              onRestore={() => handleRestoreCategory(cat)}
              onDelete={() => setDeleteId({ id: cat.id, type: 'CAT' })}
            />
          ))}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-3">
          {archivedData.tasks.length === 0 && <EmptyState text="無封存任務" />}
          {archivedData.tasks.map(task => (
            <ArchiveItem 
              key={task.id} 
              title={task.title} 
              subtitle={`所屬分類: ${parentData.categories[task.categoryId]?.name || '已移除'}`}
              onRestore={() => handleRestoreTask(task)}
              onDelete={() => setDeleteId({ id: task.id, type: 'TASK' })}
            />
          ))}
        </TabsContent>

        <TabsContent value="subtasks" className="space-y-3">
          {archivedData.subtasks.length === 0 && <EmptyState text="無封存子任務" />}
          {archivedData.subtasks.map(sub => (
            <ArchiveItem 
              key={sub.id} 
              title={sub.title} 
              subtitle={`主任務: ${parentData.tasks[sub.taskId]?.title || '已移除'}`}
              onRestore={() => handleRestoreSubTask(sub)}
              onDelete={() => setDeleteId({ id: sub.id, type: 'SUB' })}
            />
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={!!deleteConfirm} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認永久刪除？</DialogTitle>
            <DialogDescription>
              此操作將徹底移除資料且無法復原。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>取消</Button>
            <Button variant="destructive" onClick={confirmDelete}>確認刪除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ArchiveItem = ({ title, subtitle, onRestore, onDelete }: { title: string, subtitle?: string, onRestore: () => void, onDelete: () => void }) => (
  <Card className="overflow-hidden">
    <CardContent className="p-4 flex items-center justify-between">
      <div className="flex-1 min-w-0 mr-4">
        <div className="font-medium text-sm truncate">{title}</div>
        {subtitle && <div className="text-[10px] text-muted-foreground truncate mt-0.5">{subtitle}</div>}
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onRestore} className="h-8 gap-2 text-xs">
          <ArchiveRestore className="h-3.5 w-3.5" /> 還原
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground text-sm italic">
    {text}
  </div>
);
