import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MousePointer2 } from 'lucide-react';

export const QUADRANT_COLORS = {
  Q1: "#cee9f2", // DO
  Q2: "#d0ebca", // DECIDE
  Q3: "#fddfbd", // DELEGATE
  Q4: "#fca2a1", // ELIMINATE
} as const;

export interface MatrixItem {
  id: string;
  title: string;
  eisenhower: string;
  type: 'TASK' | 'SUBTASK';
  categoryColor?: string;
  parentId?: string;
  status?: string;
  isCompleted?: boolean;
}

interface MatrixQuadrantProps {
  items: MatrixItem[];
  quadrant: keyof typeof QUADRANT_COLORS;
  focusedId: string | null;
  onFocus: (id: string | null) => void;
}

export const MatrixQuadrant: React.FC<MatrixQuadrantProps> = ({
  items,
  quadrant,
  focusedId,
  onFocus,
}) => {
  const bgColor = QUADRANT_COLORS[quadrant];

  return (
    <div 
      className="h-full w-full flex flex-col overflow-y-scroll transition-colors" 
      style={{ backgroundColor: bgColor }}
    >
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {items.map((item) => {
            const isRelated = focusedId === null || item.id === focusedId || item.parentId === focusedId;
            return (
              <div 
                key={item.id} 
                onClick={() => onFocus(item.type === 'TASK' ? (focusedId === item.id ? null : item.id) : null)}
                className={`
                  text-[10px] sm:text-xs p-1.5 rounded border shadow-sm transition-all cursor-pointer flex items-center gap-2
                  ${item.type === 'TASK' ? 'font-bold bg-card/80' : 'italic bg-muted/30 ml-2 border-dashed'}
                  ${!isRelated ? 'opacity-20 grayscale' : 'opacity-100 scale-100'}
                  ${item.id === focusedId ? 'ring-2 ring-primary border-primary' : 'border-border'}
                `}
              >
                {/* Category Indicator: 3px vertical bar */}
                {item.categoryColor && (
                  <div 
                    className="w-1 self-stretch rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.categoryColor }} 
                  />
                )}
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  {item.type === 'SUBTASK' && <MousePointer2 className="h-2 w-2 flex-shrink-0" />}
                  <span className="truncate">{item.title}</span>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="text-[10px] text-muted-foreground p-4 italic text-center opacity-50">
              無項目
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};