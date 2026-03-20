import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { DailyPlanDateSelector } from './DailyPlanDateSelector';
import { formatLocalDate } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';

interface PlanToolbarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  sortByMatrix: boolean;
  onToggleSort: () => void;
  hideRoutine: boolean;
  onToggleHideRoutine: (checked: boolean) => void;
}

export const PlanToolbar: React.FC<PlanToolbarProps> = ({ 
  selectedDate, 
  onDateChange, 
  sortByMatrix,
  onToggleSort,
  hideRoutine,
  onToggleHideRoutine
}) => {
  const { setNodeRef: setPrevRef, isOver: isOverPrev } = useDroppable({ id: 'nav-prev' });
  const { setNodeRef: setNextRef, isOver: isOverNext } = useDroppable({ id: 'nav-next' });

  const shiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    onDateChange(formatLocalDate(d));
  };

  return (
    <div className="flex flex-col justify-between items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
      <div className="flex items-center gap-2">
        <Button 
          ref={setPrevRef}
          variant={isOverPrev ? "secondary" : "outline"} 
          size="icon" 
          onClick={() => shiftDate(-1)}
          className={isOverPrev ? "scale-110 ring-2 ring-primary transition-all" : "transition-all"}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <DailyPlanDateSelector 
          selectedDate={selectedDate} 
          onDateChange={onDateChange} 
        />
        <Button 
          ref={setNextRef}
          variant={isOverNext ? "secondary" : "outline"} 
          size="icon" 
          onClick={() => shiftDate(1)}
          className={isOverNext ? "scale-110 ring-2 ring-primary transition-all" : "transition-all"}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="sort-mode" 
            checked={sortByMatrix} 
            onCheckedChange={onToggleSort} 
          />
          <Label htmlFor="sort-mode" className="text-sm font-medium">
            艾森豪排序
          </Label>
        </div>

        <div className="flex items-center space-x-2 border-l pl-4">
          <Switch 
            id="hide-routine" 
            checked={hideRoutine} 
            onCheckedChange={onToggleHideRoutine} 
          />
          <Label htmlFor="hide-routine" className="text-sm font-medium">
            隱藏每日
          </Label>
        </div>
      </div>
    </div>
  );
};
