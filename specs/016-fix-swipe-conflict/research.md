# Research: Fix Swipe Conflict with Overlays

**Feature**: Fix Swipe Conflict with Overlays
**Status**: Complete

## Executive Summary
This feature addresses a bug where horizontal swipe gestures intended for date navigation in the Daily Plan view are still triggered when a Dialog or Drawer is open. The fix involves implementing a mechanism to disable swipe detection based on the presence of active overlays.

## Technical Findings

### 1. Existing Swipe Mechanism
- **Component**: `src/hooks/useSwipe.ts`.
- **Implementation**: Uses `touchstart` and `touchend` events on the task list container.
- **Problem**: The event listeners are active as long as the component is mounted, regardless of overlay state.

### 2. Overlay State Detection
- **Dialog/Drawer State**: Currently managed by local state in `DailyPlanView.tsx` (`isEditing`, `actionItem`).
- **Standard Practice**: Use a boolean flag to indicate if any overlay is active.

### 3. Blocking Swipe Gestures
- **Option A: Conditional Listener**: Pass a `disabled` prop to `useSwipe`.
- **Option B: Event Propagation**: Stop propagation in the Dialog/Drawer content.
- **Decision**: **Option A** is cleaner and more robust. Modifying the hook to respect a `disabled` flag ensures the logic is centralized and easy to test.

## Technical Decisions

### Decision: Update `useSwipe` Hook
- **Rationale**: Direct and explicit. The component using the hook knows its state and can explicitly tell the hook when to ignore inputs.
- **API Change**: 
  ```typescript
  interface UseSwipeOptions {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    threshold?: number;
    disabled?: boolean; // New prop
  }
  ```

### Decision: State Aggregation in `DailyPlanView`
- **Rationale**: `DailyPlanView` already tracks `isEditing` and `actionItem`. A derived `isOverlayOpen` constant can be passed to the hook.
- **Logic**: `const isOverlayOpen = isEditing || !!actionItem;`

## Open Questions / Risks
- **Global Modals**: If other global modals (not managed by `DailyPlanView`) are opened, they might still suffer from this bug.
- **Mitigation**: For now, the scope is limited to `DailyPlanView`. If this becomes a recurring pattern, a global "Gesture Lock" context could be implemented.

## Plan Updates
- Modify `src/hooks/useSwipe.ts` to accept `disabled` option.
- Update `src/features/daily-plan/DailyPlanView.tsx` to pass the overlay state to `useSwipe`.
