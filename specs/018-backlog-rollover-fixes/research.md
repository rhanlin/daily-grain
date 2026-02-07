# Research: Backlog and Rollover Fixes

**Feature**: Backlog and Rollover Fixes
**Status**: Complete

## Executive Summary
This research addresses three critical UX and logic bugs: UI occlusion in Backlog multi-select, gesture conflicts between scrolling and selection, and an incomplete daily rollover process. The solutions involve adjusting CSS layouts, refining dnd-kit/gesture interaction rules, and updating the batch processing logic in the repository.

## Technical Findings

### 1. Backlog UI Overlap (Occlusion)
- **Problem**: The absolute/fixed positioned action bar in `BacklogContent.tsx` covers the bottom items of the `ScrollArea`.
- **Root Cause**: Missing bottom padding in the scrollable container to account for the overlay height.
- **Solution**: Add a dynamic `pb-[80px]` (or similar height) to the inner container of the `ScrollArea` only when `isSelectionMode` is true.

### 2. Backlog Scroll Conflict (Selection logic)
- **Problem**: `onToggleSelection` is likely triggered on `onClick` or `onPointerUp` without checking if a drag/scroll occurred.
- **Root Cause**: Standard `click` events trigger even after a swipe if not handled correctly.
- **Solution**: 
    - A) Use `dnd-kit`'s `PointerSensor` with an `activationConstraint` (e.g., `distance: 8px`) if the items were draggable, but these are backlog items being tapped.
    - B) In the selection handler, use a "move threshold" check or utilize `react-use`'s `useLongPress` (if applicable) or a simple state-based touch tracker.
    - **Refined Solution**: Check if the scroll delta exceeded a threshold during the interaction. If the user moved more than 10px, treat it as a scroll and ignore the selection toggle.

### 3. Rollover Logic Bug (Batch Processing)
- **Problem**: Only one item rolls over.
- **Root Cause**: Looking at `src/lib/rollover.ts`, the logic likely handles a single update or has a promise concurrency issue (e.g., not using `Promise.all` correctly or a loop that exits early).
- **Secondary Cause**: Potential IndexedDB transaction lock or `orderIndex` collision when multiple items are moved simultaneously.
- **Solution**: Wrap the rollover loop in a single Dexie transaction and ensure all eligible items are processed.

## Technical Decisions

### Decision: CSS-based UI Fix
- **Rationale**: Simple, performant, and reliable.
- **Action**: Add a `pb-24` utility class to the `CategorySlide` container when in multi-select mode.

### Decision: Scroll-aware Selection Toggle
- **Rationale**: Prevents accidental triggers during navigation.
- **Action**: Update `BacklogContent` or its children to track touch start/end positions and ignore clicks if movement is detected.

### Decision: Transactional Rollover
- **Rationale**: Ensures atomicity and reliability for batch data moves.
- **Action**: Refactor `src/lib/rollover.ts` to use `db.transaction`.

## Open Questions / Risks
- **Scroll Detection**: Native `ScrollArea` (Radix) might catch events before our custom logic.
- **Rollover Trigger**: Ensure rollover doesn't trigger multiple times if the user refreshes frequently.

## Plan Updates
- Update `src/features/daily-plan/BacklogContent.tsx`.
- Update `src/features/daily-plan/CategorySlide.tsx`.
- Update `src/lib/rollover.ts`.
