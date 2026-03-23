# Data Model: Backlog Carousel Swipe Optimization

## UI State (Local)

### Carousel Configuration
- **Paging Logic**: Discrete snapping to individual slides.
- **Scroll Containment**: `trimSnaps` to ensure precise alignment at boundaries.

### Haptic Settings
- **Default Duration**: 20ms.
- **Debug Mode**: Boolean toggle (hardcoded or from env) to show visual feedback for haptics.

## Haptic Trace Log (Transient)
- **Time**: ISO string.
- **Result**: `Success | Unsupported | PermissionDenied`.
- **Duration**: Number (ms).
