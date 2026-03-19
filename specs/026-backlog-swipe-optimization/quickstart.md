# Quickstart: Backlog Swipe Optimization

## Verification Scenarios

### SC-001: 1:1 Tracking Feedback
1. Open Backlog on a mobile device or emulator.
2. Slowly drag the carousel horizontally.
3. **Verify**: The scale and opacity of the current and adjacent slides change smoothly in direct proportion to your finger movement.

### SC-002: Directional Locking
1. Find a category slide with many items (long vertical list).
2. Perform a horizontal swipe to switch categories.
3. **Verify**: The vertical list does not scroll or jitter while you are swiping horizontally.

### SC-003: Haptic Feedback
1. Swipe to a new category slide and let it snap.
2. **Verify**: You feel a short, subtle vibration upon snapping (on supported mobile devices).

### SC-004: Boundary Rubber-banding
1. Swipe right on the first category.
2. **Verify**: The content stretches with resistance and snaps back elegantly.
