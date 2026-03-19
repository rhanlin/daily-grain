# UI Actions: Backlog Swipe Optimization

## Carousel Events

### Action: Drag Backlog Carousel
- **Trigger**: `pointermove` or `touchmove` on the carousel area.
- **Behavior**: 
  - Update `scrollProgress` in Embla.
  - Recalculate scale/opacity for all visible slides (1:1 feedback).
  - Apply `touch-action: pan-y` to prevent vertical scroll jitter.

### Action: Snap to Slide
- **Trigger**: `pointerup` / `touchend` or `select` event from Embla.
- **Behavior**:
  - Perform smooth snap animation using spring physics.
  - Trigger `navigator.vibrate(10)` on successful focus change.
  - Update `activeIndex` state to sync with indicator.

### Action: Boundary Bounce
- **Trigger**: Dragging past index 0 or index N.
- **Behavior**:
  - Apply exponential resistance (rubber-band effect).
  - Ensure bounce-back animation is smooth and doesn't flicker.
