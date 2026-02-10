import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { type CategorySummary } from '@/hooks/useCategorySummary';

interface CategoryActionDrawerProps {
  category: CategorySummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditName: (category: CategorySummary) => void;
  onAddTask: (category: CategorySummary) => void;
  onDelete: (category: CategorySummary) => void;
}

export const CategoryActionDrawer: React.FC<CategoryActionDrawerProps> = ({
  category,
  open,
  onOpenChange,
  onEditName,
  onAddTask,
  onDelete,
}) => {
  if (!category) return null;

  return (
    <Drawer repositionInputs={false} open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
              {category.name}
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 text-base"
              onClick={() => {
                onEditName(category);
                onOpenChange(false);
              }}
            >
              <Pencil className="h-5 w-5 text-muted-foreground" />
              編輯分類名稱
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 text-base"
              onClick={() => {
                onAddTask(category);
                onOpenChange(false);
              }}
            >
              <Plus className="h-5 w-5 text-muted-foreground" />
              新增任務到此分類
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 text-base text-destructive hover:text-destructive"
              onClick={() => {
                onDelete(category);
                onOpenChange(false);
              }}
            >
              <Trash2 className="h-5 w-5" />
              刪除分類
            </Button>
          </div>
          <div className="h-8" /> {/* Spacer for bottom safe area */}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
