import { render, screen } from '@testing-library/react';
import { DraggableTask } from '../DraggableTask';
import { vi, describe, it, expect } from 'vitest';

// Mock dnd-kit useSortable
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: { 'data-testid': 'attributes' },
    listeners: { 'onKeyDown': vi.fn() },
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

describe('DraggableTask', () => {
  it('renders children and the drag handle icon', () => {
    render(
      <DraggableTask id="test-1">
        <div>Test Child</div>
      </DraggableTask>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
    const attributesElement = screen.getByTestId('attributes');
    expect(attributesElement).toBeInTheDocument();
  });

  it('hides the drag handle when disabled', () => {
    render(
      <DraggableTask id="test-1" disabled={true}>
        <div>Test Child</div>
      </DraggableTask>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
    const attributesElement = screen.queryByTestId('attributes');
    expect(attributesElement).not.toBeInTheDocument();
  });
});
