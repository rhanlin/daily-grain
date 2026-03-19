# Research: Backlog Swipe Optimization

## Decision: Enhance Carousel Physics and Progress-based Animations

### 1. Carousel Configuration Optimization
**Decision**: Update `embla-carousel-react` options in `BacklogContent.tsx`.
**Rationale**: 
- Current `duration: 25` is standard, but the "卡頓" feeling often comes from the lack of directional locking and the suddenness of the snap.
- We will add `dragFree: false` (default) but ensure `containScroll: 'trimSnaps'`.
- Most importantly, we will implement **Progress-based Animations** to replace the current `motion.div` reactive approach.

### 2. Progress-based Visual Feedback (1:1 Tracking)
**Decision**: Use Embla's `scroll` event to calculate the scale and opacity of each slide in real-time during drag.
**Rationale**:
- Current implementation only updates scale/opacity when `activeIndex` changes (after the swipe completes). This creates a "stiff" feeling.
- By mapping scroll progress to CSS variables or Framer Motion `useMotionValue`, we achieve the 1:1 tracking requested in US1.

### 3. Directional Lock and Touch Handling
**Decision**: Apply `touch-action: pan-y` to the carousel viewport and slides.
**Rationale**:
- Tells the browser that the horizontal axis is handled by the application (Embla), while vertical axis should scroll naturally.
- Prevents the "staircase" effect where a diagonal swipe triggers both carousel and vertical scroll.

### 4. Haptic Feedback Integration
**Decision**: Call `navigator.vibrate(10)` within the Embla `select` event handler.
**Rationale**:
- Provides a subtle physical confirmation when a new slide is snapped into focus.
- Lightweight and supported by most mobile browsers (PWA focus).

### 5. Component Structure Refinement
**Decision**: Optimize `CategorySlide` to reduce re-render impact.
**Rationale**: 
- Slides are heavy (many tasks/subtasks). 
- Using `React.memo` or ensuring that progress animations don't trigger full React re-renders (e.g., using Framer Motion's optimized animations) is critical.

## Alternatives Considered
- **Replacing Embla with Framer Motion Carousel**: Rejected because Embla is already integrated and handles large numbers of slides more efficiently with its snapping logic.
- **Removing animations entirely**: Rejected because it violates the "絲滑" goal.
