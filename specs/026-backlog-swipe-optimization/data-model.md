# Data Model: Backlog Swipe Optimization

## UI State

### Carousel Progress (Transient)
- **scrollProgress**: number (0 to 1) representing the total scroll distance of the carousel.
- **slideTransforms**: array of { scale, opacity } values calculated for each slide based on their distance from the viewport center.

## Constraints
- **Directional Lock**: When horizontal velocity exceeds vertical velocity by a factor of 1.5 during touch start, vertical scroll must be suppressed.
- **Haptic Limit**: Vibrate only on successful slide selection (`select` event), not on every frame of scroll.
