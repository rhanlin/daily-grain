# UI Actions: Backlog Carousel Swipe Optimization

## Feature: Carousel Swipe

### Action: Paging Snap
- **Trigger**: Embla `select` event.
- **Payload**: `index: number`.
- **Logic**:
    1. Update `activeIndex` state.
    2. Call `triggerHaptic(20)`.
    3. Haptic logic:
        - Check `navigator.vibrate`.
        - If exists: `vibrate(20)`.
        - If debug enabled: Show `sonner` toast: "Haptic: 20ms".

### Action: Initial Snap Correction
- **Trigger**: Carousel initialization.
- **Logic**: Ensure index 0 (placeholder) is skipped and snapped to 1.

## Feature: Performance Tuning

### Optimization: Remove Scroll Updates
- **Old Behavior**: Update `MotionValue` on every `scroll` event.
- **New Behavior**: Static style based on `activeIndex` or simple CSS transitions.
