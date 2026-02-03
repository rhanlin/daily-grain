import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, ArrowLeft, ArrowRight } from 'lucide-react';

interface PlanToolbarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  sortByMatrix: boolean;
  onToggleSort: () => void;
}

export const PlanToolbar: React.FC<PlanToolbarProps> = ({ 
  selectedDate, 
  onDateChange, 
  sortByMatrix,
  onToggleSort
}) => {
  const shiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    onDateChange(d.toISOString().split('T')[0]);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => shiftDate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg font-mono font-bold">
          <CalendarIcon className="h-4 w-4" />
          {selectedDate}
        </div>
        <Button variant="outline" size="icon" onClick={() => shiftDate(1)}>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

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
    </div>
  );
};
