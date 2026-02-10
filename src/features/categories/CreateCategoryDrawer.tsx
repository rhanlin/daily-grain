import React, { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { repository } from '@/lib/repository';
import { toast } from 'sonner';

interface CreateCategoryDrawerProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#a855f7', // purple
  '#ec4899', // pink
];

export const CreateCategoryDrawer: React.FC<CreateCategoryDrawerProps> = ({ children, open, onOpenChange }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await repository.categories.create(name.trim(), color);
      toast.success('分類已建立');
      setName('');
      setColor(COLORS[0]);
      if (onOpenChange) onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error('建立失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer repositionInputs={false} open={open} onOpenChange={onOpenChange}>
      {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>新增分類</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name">分類名稱</Label>
                <Input
                  id="cat-name"
                  placeholder="例如：工作、生活、運動"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label>標籤顏色</Label>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        color === c ? 'border-primary scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DrawerFooter className="px-0">
              <Button type="submit" disabled={isSubmitting || !name.trim()}>
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
