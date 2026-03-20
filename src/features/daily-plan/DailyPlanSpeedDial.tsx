import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Inbox, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DailyPlanSpeedDialProps {
  onOpenBacklog: () => void;
  onOpenQuickAdd: () => void;
}

export const DailyPlanSpeedDial: React.FC<DailyPlanSpeedDialProps> = ({
  onOpenBacklog,
  onOpenQuickAdd,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const actions = [
    {
      id: 'quick-add',
      icon: <PenLine className="h-5 w-5" />,
      label: '快捷新增任務',
      onClick: () => {
        onOpenQuickAdd();
        setIsOpen(false);
      },
      color: 'bg-primary text-primary-foreground',
    },
    {
      id: 'backlog',
      icon: <Inbox className="h-5 w-5" />,
      label: '從待辦挑選',
      onClick: () => {
        onOpenBacklog();
        setIsOpen(false);
      },
      color: 'bg-primary text-primary-foreground',
    },
  ];

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-4">
      {/* Backdrop Blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[-1]"
          />
        )}
      </AnimatePresence>

      {/* Options */}
      <div className="flex flex-col items-end gap-3 mb-2">
        <AnimatePresence>
          {isOpen &&
            actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }
                }}
                exit={{ 
                  opacity: 0, 
                  y: 20, 
                  scale: 0.8,
                  transition: { delay: (actions.length - 1 - index) * 0.05 }
                }}
                className="flex items-center gap-3 group"
              >
                <span className="px-2 py-1 rounded bg-popover text-popover-foreground text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
                  {action.label}
                </span>
                <Button
                  size="icon"
                  className={cn("h-12 w-12 rounded-full shadow-lg ring-2 ring-background", action.color)}
                  onClick={action.onClick}
                >
                  {action.icon}
                </Button>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* Main Trigger */}
      <Button
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-all duration-300",
          isOpen ? "bg-muted text-muted-foreground rotate-45" : "bg-primary text-primary-foreground"
        )}
        onClick={toggle}
      >
        <Plus className="h-7 w-7" />
      </Button>
    </div>
  );
};
