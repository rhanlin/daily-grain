import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface DraggableTaskProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const DraggableTask: React.FC<DraggableTaskProps> = ({ id, children, disabled = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-1 group/draggable">
      {!disabled && (
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-1.5 text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
};
