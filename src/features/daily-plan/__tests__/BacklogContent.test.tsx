import { render, screen, fireEvent } from '@testing-library/react';
import { BacklogContent } from '../BacklogContent';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mock hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/hooks/useBacklog', () => ({
  useBacklog: (date: string) => {
    if (date === 'empty') {
      return { groups: [], loading: false };
    }
    return { 
      groups: [{ category: { id: '1', name: 'Cat 1', color: '#000' }, tasks: [], subtasks: [] }], 
      loading: false 
    };
  }
}));

vi.mock('@/hooks/useDailyPlan', () => ({
  useDailyPlan: () => ({
    addToPlan: vi.fn(),
  })
}));

describe('BacklogContent Empty State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show "前往任務管理" button when backlog is empty', () => {
    render(
      <BrowserRouter>
        <BacklogContent 
          selectedDate="empty" 
          scheduledMap={new Map()} 
          isDesktop={false} 
          onItemTap={vi.fn()} 
          activeIndex={0} 
          onActiveIndexChange={vi.fn()} 
        />
      </BrowserRouter>
    );

    expect(screen.getByText('無任務項目')).toBeInTheDocument();
    expect(screen.getByText('前往任務管理')).toBeInTheDocument();
  });

  it('should navigate to /management and call onClose when button is clicked', () => {
    const mockOnClose = vi.fn();
    render(
      <BrowserRouter>
        <BacklogContent 
          selectedDate="empty" 
          scheduledMap={new Map()} 
          isDesktop={false} 
          onItemTap={vi.fn()} 
          activeIndex={0} 
          onActiveIndexChange={vi.fn()} 
          onClose={mockOnClose}
        />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('前往任務管理'));

    expect(mockNavigate).toHaveBeenCalledWith('/management');
    expect(mockOnClose).toHaveBeenCalled();
  });
});
