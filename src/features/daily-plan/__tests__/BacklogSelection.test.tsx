import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BacklogContent } from '../BacklogContent';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('@/hooks/useBacklog', () => ({
  useBacklog: () => ({
    groups: [
      {
        category: { id: 'cat1', name: 'Category 1', color: '#ff0000' },
        tasks: [{ id: 't1', title: 'Task 1' }],
        subtasks: [
          { id: 'sub1', taskId: 't1', title: 'Sub 1' },
          { id: 'sub2', taskId: 't1', title: 'Sub 2' },
        ]
      },
      {
        category: { id: 'cat2', name: 'Category 2', color: '#00ff00' },
        tasks: [{ id: 't2', title: 'Task 2' }],
        subtasks: [
          { id: 'sub3', taskId: 't2', title: 'Sub 3' },
        ]
      }
    ],
    loading: false
  })
}));

const mockAddToPlan = vi.fn();
vi.mock('@/hooks/useDailyPlan', () => ({
  useDailyPlan: () => ({
    addToPlan: mockAddToPlan
  })
}));

// Mock dnd-kit
vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  }),
  useDroppable: () => ({
    setNodeRef: vi.fn(),
  })
}));

// Mock CategorySlide to capture props and trigger events
vi.mock('../CategorySlide', () => ({
  CategorySlide: (props: any) => (
    <div data-testid={`slide-${props.category.id}`} className={props.isSelectionMode && props.activeCategoryId !== props.category.id ? 'locked' : ''}>
      <span>{props.category.name}</span>
      {!props.isSelectionMode || props.activeCategoryId === props.category.id ? (
        <>
          <button onClick={() => props.onStartSelection('sub1', 'cat1')}>Start sub1</button>
          <button onClick={() => props.onToggleSelection('sub2', 'cat1')}>Toggle sub2</button>
          <button onClick={() => props.onStartSelection('sub3', 'cat2')}>Start sub3</button>
        </>
      ) : (
        <span data-testid="locked-msg">Locked</span>
      )}
    </div>
  )
}));

describe('BacklogContent Multi-select logic (Category Scope)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock matchMedia for useMedia hook
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('should manage selection within a category and lock other categories', async () => {
    render(
      <BacklogContent 
        selectedDate="2026-02-04" 
        scheduledMap={new Map()} 
        isDesktop={false} 
        onItemTap={() => {}} 
        activeIndex={1} 
        onActiveIndexChange={() => {}} 
      />
    );

    // 1. Initial State
    expect(screen.queryByText(/加入今日計畫/)).not.toBeInTheDocument();

    // 2. Start selection in Cat 1
    fireEvent.click(screen.getByText('Start sub1'));
    expect(screen.getByText(/加入今日計畫 \(1\)/)).toBeInTheDocument();
    
    // Cat 2 should be locked (mocked UI shows 'Locked')
    expect(screen.getByTestId('slide-cat2')).toHaveClass('locked');
    expect(screen.getByText('Locked')).toBeInTheDocument();

    // 3. Toggle another item in same Cat 1
    fireEvent.click(screen.getByText('Toggle sub2'));
    expect(screen.getByText(/加入今日計畫 \(2\)/)).toBeInTheDocument();

    // 4. Batch add
    fireEvent.click(screen.getByText(/加入今日計畫 \(2\)/));
    
    await waitFor(() => {
      expect(mockAddToPlan).toHaveBeenCalledTimes(2);
      expect(mockAddToPlan).toHaveBeenCalledWith('sub1', 'SUBTASK');
      expect(mockAddToPlan).toHaveBeenCalledWith('sub2', 'SUBTASK');
    });

    // 5. Mode should reset
    expect(screen.queryByText(/加入今日計畫/)).not.toBeInTheDocument();
    expect(screen.getByTestId('slide-cat2')).not.toHaveClass('locked');
  });

  it('should switch category if starting selection in a new one', async () => {
    render(
      <BacklogContent 
        selectedDate="2026-02-04" 
        scheduledMap={new Map()} 
        isDesktop={false} 
        onItemTap={() => {}} 
        activeIndex={1} 
        onActiveIndexChange={() => {}} 
      />
    );

    fireEvent.click(screen.getByText('Start sub1')); // In Cat 1
    expect(screen.getByText(/加入今日計畫 \(1\)/)).toBeInTheDocument();

    // Choice B logic: onToggleSelection with different category switches scope
    // Actually our mock uses onStartSelection for sub3
    fireEvent.click(screen.getByText('Start sub3')); // In Cat 2
    expect(screen.getByText(/加入今日計畫 \(1\)/)).toBeInTheDocument();
    expect(screen.getByTestId('slide-cat1')).toHaveClass('locked');
  });
});