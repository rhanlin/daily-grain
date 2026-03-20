import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SideGuidePanelsProps {
  isVisible: boolean;
}

export const SideGuidePanels: React.FC<SideGuidePanelsProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <GuidePanel direction="prev" id="side-panel-prev" label="前一天" icon={<ChevronLeft className="h-6 w-6" />} />
          <GuidePanel direction="next" id="side-panel-next" label="後一天" icon={<ChevronRight className="h-6 w-6" />} />
        </>
      )}
    </AnimatePresence>
  );
};

const GuidePanel: React.FC<{ direction: 'prev' | 'next', id: string, label: string, icon: React.ReactNode }> = ({ 
  direction, 
  id, 
  label, 
  icon 
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const isLeft = direction === 'prev';

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed top-0 bottom-0 w-[12%] z-50 flex items-center justify-center pointer-events-auto
        ${isLeft ? 'left-0' : 'right-0'}
      `}
    >
      {/* Muted Edge Indicator (Standard grey/primary theme) */}
      <motion.div
        animate={{
          width: isOver ? '100%' : '2px',
          opacity: isOver ? 0.2 : 0.05,
          background: isOver 
            ? `linear-gradient(${isLeft ? '90deg' : '270deg'}, var(--primary) 0%, transparent 100%)`
            : `linear-gradient(${isLeft ? '90deg' : '270deg'}, var(--muted-foreground) 0%, transparent 100%)`,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className={`absolute inset-y-0 ${isLeft ? 'left-0' : 'right-0'}`}
      />

      {/* Elegant Indicator with subtle glass effect */}
      <motion.div
        animate={{ 
          scale: isOver ? 1.05 : 0.9,
          x: isOver ? (isLeft ? 5 : -5) : 0,
          opacity: isOver ? 0.8 : 0.15
        }}
        className="flex flex-col items-center gap-3 z-10"
      >
        <div className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300
          ${isOver 
            ? 'bg-primary/5 border-primary/20 text-primary/80 shadow-md' 
            : 'bg-background/10 border-transparent text-muted-foreground/50'
          }`}
        >
          {icon}
        </div>
        <span className={`text-[9px] uppercase tracking-[0.3em] font-bold [writing-mode:vertical-lr] transition-colors duration-300
          ${isOver ? 'text-primary/60' : 'text-muted-foreground/30'}
        `}>
          {label}
        </span>
      </motion.div>

      {/* Subtle Depth Background when Hovered */}
      <AnimatePresence>
        {isOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
