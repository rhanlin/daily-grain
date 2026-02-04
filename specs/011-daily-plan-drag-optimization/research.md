# Research: Daily Plan Drag Optimization

**Feature**: Daily Plan Drag Optimization
**Status**: Complete

## Executive Summary
The primary friction in the mobile Daily Plan experience is the gesture conflict between long-press (for reordering) and long-press (for context menus). This research concludes that the most robust solution is to move to an explicit "Handle-based" drag system and replace long-press menus with an explicit "More" button, ensuring gesture clarity and consistency across the app. Additionally, logic conflicts between automated matrix sorting and manual reordering must be resolved by disabling dragging when matrix sorting is active.

## Technical Decisions

### 1. Drag Handle Implementation (dnd-kit)
- **Decision**: Use `dnd-kit`'s `useSortable` with a dedicated `DragHandle` component.
- **Rationale**: By default, `useSortable` makes the entire element a trigger. By separating the listeners and applying them ONLY to a handle element (FR-001, FR-002), we eliminate accidental drags when the user intends to tap or scroll on the card body.
- **Implementation**: Pass `listeners` and `attributes` only to the Handle component, not the root card element.

### 2. Global Removal of Long-Press
- **Decision**: Remove all instances of `useLongPress` (react-use) and replace with `MoreHorizontal` (Lucide) button triggers.
- **Rationale**: Long-press is often unreliable on mobile browsers due to native selection behaviors and varies across OS versions. Explicit buttons (FR-003, FR-004) are more accessible and eliminate race conditions with scrolling or dragging.

### 3. Touch Sensor Calibration
- **Decision**: Adjust `TouchSensor` activation constraints in `DailyPlanPage.tsx`.
- **Rationale**: Even with a handle, touch sensors need a slight delay or distance threshold (FR-005) to prevent "jerry" movement during fast scrolls.
- **Config**: 
  ```typescript
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 5,
    },
  })
  ```

### 4. Sorting Logic & Container Sync
- **Decision**: Fix logic conflicts between manual and automated sorting.
- **Conflict 1**: "Sort by Matrix" (automated) vs Dragging (manual). **Decision**: Disable drag handles when matrix sorting is active (FR-007).
- **Conflict 2**: `DailyPlanPage` reorder handler requires a `'daily-plan'` container ID which was missing in `DailyPlanView`. **Decision**: Explicitly set the ID in `SortableContext` (FR-008).

## Open Questions / Risks
- **Risk**: Users familiar with long-press might be confused by the change.
- **Mitigation**: The `MoreHorizontal` icon is a standard UI pattern that is highly intuitive.

## Plan Updates
- No new dependencies.
- Global refactor of card components required.