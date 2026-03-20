import { render, screen } from '@testing-library/react';
import { DailyPlanView } from '../DailyPlanView';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock matchMedia
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock components and hooks
vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children, id }: { children: React.ReactNode, id: string }) => <div data-testid="sortable-context" data-id={id}>{children}</div>,
  verticalListSortingStrategy: {},
}));

vi.mock('@/hooks/useDailyPlan', () => ({
  useDailyPlan: () => ({
    planItems: [{ id: '1', refId: 't1', refType: 'TASK' }],
    triggerRollover: vi.fn(),
    removeFromPlan: vi.fn(),
  }),
}));

vi.mock('@/components/dnd/DraggableTask', () => ({
  DraggableTask: ({ children, disabled }: { children: React.ReactNode, disabled: boolean }) => (
    <div data-testid="draggable-item" data-disabled={disabled}>
      {children}
    </div>
  ),
}));

vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: () => [{ id: '1', refId: 't1', refType: 'TASK', data: { title: 'Test Task', eisenhower: 'Q1' } }],
}));

vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({ setNodeRef: vi.fn() }),
  useDndContext: () => ({ active: null }),
}));

describe('DailyPlanView', () => {
  it('renders SortableContext with correct ID', async () => {
    render(<DailyPlanView selectedDate="2026-02-04" onDateChange={vi.fn()} onQuickAdd={vi.fn()} hideRoutine={false} onToggleHideRoutine={vi.fn()} />);
    
    const context = await screen.findByTestId('sortable-context');
    expect(context).toHaveAttribute('data-id', 'daily-plan');
  });

  it('passes disabled=false to items when matrix sort is off', async () => {
    render(<DailyPlanView selectedDate="2026-02-04" onDateChange={vi.fn()} onQuickAdd={vi.fn()} hideRoutine={false} onToggleHideRoutine={vi.fn()} />);
    
    const item = await screen.findByTestId('draggable-item');
    expect(item).toHaveAttribute('data-disabled', 'false');
  });
});
