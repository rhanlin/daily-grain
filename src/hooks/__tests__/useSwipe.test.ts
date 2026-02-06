import { renderHook } from '@testing-library/react';
import { useSwipe } from '../useSwipe';
import { describe, it, expect, vi } from 'vitest';

describe('useSwipe', () => {
  it('should trigger onSwipeLeft when swiped left', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeLeft, onSwipeRight }));

    // Mock touch start
    result.current.onTouchStart({
      touches: [{ clientX: 100, clientY: 0 }]
    } as any);

    // Mock touch end
    result.current.onTouchEnd({
      changedTouches: [{ clientX: 40, clientY: 0 }]
    } as any);

    expect(onSwipeLeft).toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('should trigger onSwipeRight when swiped right', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeLeft, onSwipeRight }));

    // Mock touch start
    result.current.onTouchStart({
      touches: [{ clientX: 100, clientY: 0 }]
    } as any);

    // Mock touch end
    result.current.onTouchEnd({
      changedTouches: [{ clientX: 160, clientY: 0 }]
    } as any);

    expect(onSwipeRight).toHaveBeenCalled();
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('should not trigger anything when disabled', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeLeft, onSwipeRight, disabled: true }));

    // Mock touch start
    result.current.onTouchStart({
      touches: [{ clientX: 100, clientY: 0 }]
    } as any);

    // Mock touch end
    result.current.onTouchEnd({
      changedTouches: [{ clientX: 40, clientY: 0 }]
    } as any);

    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('should not trigger if threshold is not met', () => {
    const onSwipeLeft = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeLeft, threshold: 50 }));

    result.current.onTouchStart({ touches: [{ clientX: 100, clientY: 0 }] } as any);
    result.current.onTouchEnd({ changedTouches: [{ clientX: 60, clientY: 0 }] } as any); // deltaX = 40 < 50

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('should not trigger if swipe is more vertical than horizontal', () => {
    const onSwipeLeft = vi.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeLeft }));

    result.current.onTouchStart({ touches: [{ clientX: 100, clientY: 100 }] } as any);
    result.current.onTouchEnd({ changedTouches: [{ clientX: 40, clientY: 200 }] } as any); // deltaX = -60, deltaY = 100

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });
});
