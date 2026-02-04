import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface QuickCreateTaskDrawerProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultCategoryId?: string;
}

export const QuickCreateTaskDrawer: React.FC<QuickCreateTaskDrawerProps> = ({ children, open, onOpenChange, defaultCategoryId }) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string>(defaultCategoryId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = useLiveQuery(() => db.categories.filter(c => !c.isArchived).toArray());

  useEffect(() => {
    if (defaultCategoryId) {
      setCategoryId(defaultCategoryId);
    } else if (categories && categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId, defaultCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId) return;

    setIsSubmitting(true);
    try {
      const newTask = {
        id: uuidv4(),
        categoryId,
        title: title.trim(),
        description: '',
        status: 'TODO' as const,
        eisenhower: 'Q2' as const,
        updatedAt: new Date().toISOString(),
      };

      await db.tasks.add(newTask);
      toast.success('任務已建立');
      setTitle('');
      if (onOpenChange) onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error('建立失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>快速新增任務</DrawerTitle>
            <DrawerDescription>輸入任務名稱與選擇分類即可快速建立。</DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">任務名稱</Label>
                <Input
                  id="title"
                  placeholder="例如：買牛奶"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">所屬分類</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="選擇分類" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DrawerFooter className="px-0">
              <Button type="submit" disabled={isSubmitting || !title.trim()}>
                {isSubmitting ? '建立中...' : '確認建立'}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">取消</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
