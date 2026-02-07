import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { CategorySlide } from '../CategorySlide';

// Mock dnd-kit since we don't need its full functionality here
vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    isDragging: false,
  }),
}));

describe('Backlog Gesture Isolation', () => {
  const mockCategory = { id: 'c1', name: 'Cat 1', color: '#000', isArchived: false, createdAt: '', updatedAt: '' } as any;
  const mockSubTask = { id: 's1', taskId: 't1', title: 'Sub 1', isCompleted: false, eisenhower: 'Q1', createdAt: '', updatedAt: '' } as any;

  it('should trigger onItemTap on a simple click/tap', () => {
    const onItemTap = vi.fn();
    const { getByText } = render(
      <CategorySlide
        category={mockCategory}
        tasks={[]}
        subtasks={[mockSubTask]}
        scheduledMap={new Map()}
        isDesktop={false}
        onItemTap={onItemTap}
      />
    );

    const item = getByText('Sub 1');
    
    // Simulate tap
    fireEvent.pointerDown(item, { clientX: 100, clientY: 100 });
    fireEvent.pointerUp(item, { clientX: 102, clientY: 102 }); // Small move < 10px

    expect(onItemTap).toHaveBeenCalledWith('s1', 'SUBTASK');
  });

  it('should NOT trigger onItemTap when scrolling (large movement)', () => {
    const onItemTap = vi.fn();
    const { getByText } = render(
      <CategorySlide
        category={mockCategory}
        tasks={[]}
        subtasks={[mockSubTask]}
        scheduledMap={new Map()}
        isDesktop={false}
        onItemTap={onItemTap}
      />
    );

    const item = getByText('Sub 1');
    
    // Simulate scroll
    fireEvent.pointerDown(item, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(item, { clientX: 100, clientY: 150 }); // Large move > 10px
    fireEvent.pointerUp(item, { clientX: 100, clientY: 150 });

    expect(onItemTap).not.toHaveBeenCalled();
  });
});
