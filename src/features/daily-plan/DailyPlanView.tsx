import React, { useState, useEffect } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDailyPlan } from '@/hooks/useDailyPlan';
import { PlanToolbar } from './PlanToolbar';
import { DraggableTask } from '@/components/dnd/DraggableTask';
import { TaskItem } from '../tasks/TaskItem';
import { db, type Task } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDroppable, useDndContext } from '@dnd-kit/core';
import { X, Trash2, Pencil, Infinity as InfinityIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { repository } from '@/lib/repository';
import { useMedia } from 'react-use';
import { getLocalToday, addDays, subDays } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipe } from '@/hooks/useSwipe';
import { toast } from 'sonner';

interface DailyPlanViewProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  openDrawer: () => void;
}

export const DailyPlanView: React.FC<DailyPlanViewProps> = ({ selectedDate, onDateChange, openDrawer }) => {
  const { planItems, triggerRollover, removeFromPlan } = useDailyPlan(selectedDate);
  const [sortByMatrix, setSortByMatrix] = useState(false);
  const [actionItem, setActionItem] = useState<any | null>(null);
  // US2: Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editingItemMeta, setEditingItemMeta] = useState<{ refId: string, refType: 'TASK' | 'SUBTASK' } | null>(null);
  
  // FR-003: Track direction for animations
  const [direction, setDirection] = useState<number>(0);

  const { active } = useDndContext();
  const isDesktop = useMedia("(min-width: 768px)");

  // SC-001: Derive overlay state to block swipes
  const isOverlayOpen = isEditing || !!actionItem;

  // US1: Swipe gesture integration
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      setDirection(1);
      onDateChange(addDays(selectedDate, 1));
    },
    onSwipeRight: () => {
      setDirection(-1);
      onDateChange(subDays(selectedDate, 1));
    },
    disabled: isOverlayOpen,
  });
  
  const { setNodeRef } = useDroppable({
    id: 'daily-plan-dropzone',
    disabled: active?.data.current?.type !== 'BACKLOG_ITEM',
  });

  useEffect(() => {
    const today = getLocalToday();
    if (selectedDate === today) {
      triggerRollover();
    }
  }, [selectedDate, triggerRollover]);

  // Create a stable dependency for the query to prevent unnecessary re-runs
  // and ensure we don't return a new array reference if the data hasn't changed.
  const planItemsSignature = JSON.stringify(planItems);

  // We need the actual Task/Subtask objects to render
  const resolvedItems = useLiveQuery(async () => {
    const results = [];
    for (const item of planItems) {
      let data;
      let parentTask;
      if (item.refType === 'TASK') {
        data = await db.tasks.get(item.refId);
      } else {
        data = await db.subtasks.get(item.refId);
        if (data) {
          parentTask = await db.tasks.get(data.taskId);
        }
      }
      results.push({ ...item, data, parentTask });
    }
    return results;
  }, [planItemsSignature]);

  // Keep track of the last valid items to prevent flickering to empty during re-fetches
  const lastValidItemsRef = React.useRef<any[]>([]);
  if (resolvedItems) {
    lastValidItemsRef.current = resolvedItems;
  }
  
  const displayItems = resolvedItems || lastValidItemsRef.current || [];
  
  // Sort by Matrix if toggled
  const sortedDisplayItems = [...displayItems].sort((a, b) => {
    if (!sortByMatrix) return 0;
    // Manual sort by Eisenhower weight (Q1 > Q2 > Q3 > Q4)
    const weights: Record<string, number> = { 'Q1': 1, 'Q2': 2, 'Q3': 3, 'Q4': 4 };
    const weightA = a.data?.eisenhower ? weights[a.data.eisenhower] : 5;
    const weightB = b.data?.eisenhower ? weights[b.data.eisenhower] : 5;
    return weightA - weightB;
  });

  const handleRemove = (id: string) => {
    removeFromPlan(id);
    setActionItem(null);
  };

  const handleStartEdit = () => {
    if (actionItem?.data) {
      setEditTitle(actionItem.data.title);
      setEditingItemMeta({ refId: actionItem.refId, refType: actionItem.refType });
      setIsEditing(true);
      setActionItem(null); // Close Drawer
    }
  };

  const handleSubmitEdit = async () => {
    if (!editTitle.trim() || !editingItemMeta) {
      toast.error('標題不能為空');
      return;
    }

    try {
      if (editingItemMeta.refType === 'TASK') {
        await repository.tasks.update(editingItemMeta.refId, { title: editTitle.trim() });
      } else {
        await repository.subtasks.update(editingItemMeta.refId, { title: editTitle.trim() });
      }
      toast.success('標題已更新');
      setIsEditing(false);
      setEditingItemMeta(null);
    } catch (e) {
      console.error(e);
      toast.error('更新失敗');
    }
  };

  // FR-003: Animation variants
  const variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="space-y-6" {...(!isDesktop ? swipeHandlers : {})}>
      <PlanToolbar 
        selectedDate={selectedDate} 
        onDateChange={onDateChange} 
        sortByMatrix={sortByMatrix}
        onToggleSort={() => setSortByMatrix(!sortByMatrix)}
      />

      <div ref={setNodeRef} className="space-y-2 min-h-[400px] border-2 border-transparent rounded-xl transition-colors overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={selectedDate}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", duration: 0.1, stiffness: 800, damping: 40 }}
            className="space-y-2"
          >
            <SortableContext 
              id="daily-plan"
              items={planItems.map(i => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedDisplayItems.map((item) => (
                <PlanItemWrapper 
                  key={item.id} 
                  item={item} 
                  isDesktop={isDesktop} 
                  disabled={sortByMatrix}
                  onRemove={() => handleRemove(item.id)}
                  onOpenMenu={() => setActionItem(item)}
                />
              ))}
            </SortableContext>

            {displayItems.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-xl" onClick={openDrawer}>
                <p className="text-muted-foreground italic">今日尚無計畫項目</p>
                <p className="text-xs text-muted-foreground">點擊展開「待辦清單」新增項目</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Drawer open={!!actionItem} onOpenChange={(open) => !open && setActionItem(null)}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>{actionItem?.data?.title}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 space-y-2">
              <Button variant="outline" className="w-full justify-start gap-3 h-12 text-base" onClick={handleStartEdit}>
                <Pencil className="h-5 w-5" /> 編輯標題
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12 text-base text-destructive hover:text-destructive" onClick={() => handleRemove(actionItem.id)}>
                <Trash2 className="h-5 w-5" /> 從今日計畫移除
              </Button>
            </div>
            <div className="h-8" />
          </div>
        </DrawerContent>
      </Drawer>

      <Dialog open={isEditing} onOpenChange={(open) => {
        setIsEditing(open);
        if (!open) setEditingItemMeta(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯標題</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">標題</Label>
              <Input 
                id="title" 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitEdit()}
                autoFocus 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>取消</Button>
            <Button onClick={handleSubmitEdit}>確認</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PlanItemWrapper: React.FC<{ item: any, isDesktop: boolean, disabled?: boolean, onRemove: () => void, onOpenMenu: () => void }> = ({ item, isDesktop, disabled, onRemove, onOpenMenu }) => {
  return (
    <DraggableTask id={item.id} disabled={disabled}>
      <div 
        className={`relative flex-1 ${item.isRollover ? 'border-l-4 border-orange-400 pl-2' : ''} bg-background rounded-lg group duration-75`}
      >
        {item.isRollover && (
          <span className="text-[10px] text-orange-500 font-bold uppercase absolute -top-4 left-0">
            昨日延宕
          </span>
        )}
        
        {isDesktop && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-sm"
            onPointerDown={(e) => { e.stopPropagation(); onRemove(); }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        {item.refType === 'TASK' && item.data ? (
          <TaskItem task={item.data as Task} viewMode="daily-plan" />
        ) : (
          <PlanSubTaskItem item={item} isDesktop={isDesktop} onOpenMenu={onOpenMenu}  />
        )}
      </div>
    </DraggableTask>
  );
};

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useSubTask } from '@/hooks/useSubTask';

// New component specifically for rendering a sub-task within the daily plan
const PlanSubTaskItem: React.FC<{ item: any, isDesktop: boolean, onOpenMenu: () => void }> = ({ item, isDesktop, onOpenMenu }) => {
  const { subtasks } = useSubTask(item.parentTask?.id);
  const subtaskDef = subtasks.find((s: any) => s.id === item.refId);

  if (!item.data || !item.parentTask) {
    return null; // Or a loading/error state
  }
  
  const handleCheckedChange = async (checked: boolean) => {
    await repository.dailyPlan.toggleCompletion(item.id, checked);
  };

  const isExceeded = subtaskDef?.type === 'multi-time' && 
    (subtaskDef as any).completedCount > (subtaskDef.repeatLimit || 0);

  return (
    <div className={`border rounded-lg p-3 bg-card flex items-center gap-2 shadow-sm text-sm transition-opacity ${item.isCompleted ? 'opacity-40' : ''}`}>
      <Checkbox
        checked={item.isCompleted}
        onCheckedChange={handleCheckedChange}
        onClick={(e) => e.stopPropagation()}
      />
      <span className="font-semibold text-muted-foreground truncate">{item.parentTask?.title}</span>
      <span className="text-muted-foreground">/</span>
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <span className={`font-medium truncate ${item.isCompleted ? 'line-through' : ''}`}>{item.data?.title}</span>
        {subtaskDef?.type === 'multi-time' && (
          <span className={`text-[10px] font-mono shrink-0 ${isExceeded ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
            ({(subtaskDef as any).completedCount || 0}/{subtaskDef.repeatLimit})
          </span>
        )}
        {subtaskDef?.type === 'daily' && <InfinityIcon className="h-3 w-3 text-blue-400 shrink-0" />}
      </div>
      <Badge variant={(item.data?.eisenhower?.toLowerCase() || 'q4') as 'q1' | 'q2' | 'q3' | 'q4'} className="text-[10px] ml-auto">
        {item.data?.eisenhower || 'Q4'}
      </Badge>
      {!isDesktop && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground opacity-40 active:opacity-100"
          onClick={(e) => { e.stopPropagation(); onOpenMenu(); }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};