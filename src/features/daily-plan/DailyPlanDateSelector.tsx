import React from 'react';
import { format, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useMedia } from 'react-use';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DailyPlanDateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const DailyPlanDateSelector: React.FC<DailyPlanDateSelectorProps> = ({ 
  selectedDate, 
  onDateChange 
}) => {
  const isDesktop = useMedia('(min-width: 768px)', true);
  const [isOpen, setIsOpen] = React.useState(false);

  const date = parseISO(selectedDate);
  const displayDate = format(date, 'yyyy/MM/dd (EEEE)', { locale: zhTW });

  const handleSelect = (selected: Date | undefined) => {
    if (selected) {
      onDateChange(format(selected, 'yyyy-MM-dd'));
      setIsOpen(false);
    }
  };

  const CalendarContent = (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleSelect}
      locale={zhTW}
      initialFocus
      className='w-full'
    />
  );

  const Trigger = (
    <Button
      variant="ghost"
      className={cn(
        "text-xl font-bold p-0 hover:bg-accent/50 px-2 py-1 rounded-md transition-colors flex items-center gap-2",
        isOpen && "bg-accent"
      )}
    >
      <span>{displayDate}</span>
    </Button>
  );

  if (isDesktop) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          {Trigger}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {CalendarContent}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer direction="top" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {Trigger}
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex justify-center pb-safe">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            locale={zhTW}
            initialFocus
            className='w-full max-w-[calc(100vw-2rem)] mx-auto'
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};