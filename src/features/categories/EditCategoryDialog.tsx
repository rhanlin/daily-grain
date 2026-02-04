import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { repository } from '@/lib/repository';
import { toast } from 'sonner';
import { type CategorySummary } from '@/hooks/useCategorySummary';

interface EditCategoryDialogProps {
  category: CategorySummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
  category,
  open,
  onOpenChange,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !name.trim()) return;

    try {
      await repository.categories.update(category.id, { 
        name: name.trim(),
        color: color 
      });
      toast.success('分類已更新');
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error('更新失敗');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>編輯分類</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-cat-name">分類名稱</Label>
              <Input
                id="edit-cat-name"
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
          <DialogFooter>
            <Button type="submit" disabled={!name.trim()}>儲存變更</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
