# Research: Daily Plan UX Enhancement

**Feature**: Daily Plan UX Enhancement
**Status**: Complete

## Executive Summary
This feature enhances the Daily Plan page with two key mobile-first optimizations: horizontal swipe navigation for dates with sliding animations, and the ability to edit task/subtask titles directly from the plan's context menu.

## Technical Findings

### 1. Swipe Navigation & Gesture Detection
- **Decision**: Implement a custom `useSwipe` hook.
- **Rationale**: `react-use` doesn't have a standard horizontal swipe hook that handles threshold and direction easily without extra dependencies. A simple hook using `touchstart` and `touchend` is lightweight and fits the MVP principle.
- **Direction Logic**: 
    - Swipe Left (deltaX < -threshold) -> Go to Tomorrow.
    - Swipe Right (deltaX > threshold) -> Go to Yesterday.

### 2. Over-the-air (Slide) Animations
- **Decision**: Use Framer Motion's `AnimatePresence` and `motion.div`.
- **Rationale**: Framer Motion is already used in the project (Backlog carousel). It provides standard `variants` for slide-in/slide-out effects.
- **Implementation**:
    - Wrap the task list in `AnimatePresence`.
    - Key the container with `selectedDate`.
    - Use a `custom` prop to determine slide direction (left or right) based on whether the new date is before or after the old one.

### 3. Edit Title UI
- **Decision**: Add a Shadcn UI `Dialog` to `DailyPlanView`.
- **Rationale**: Confirmed by User (Option A). This provides a focused editing environment.
- **Logic**:
    - The `actionItem` in `DailyPlanView` already contains `refId` and `refType`.
    - Call `repository.tasks.update` or `repository.subtasks.update` based on `refType`.

## Technical Decisions

### Decision: Custom `useSwipe` Hook
- **Rationale**: High performance, zero extra deps, full control over gesture threshold (e.g., 50px).

### Decision: Framer Motion for Transitions
- **Rationale**: Consistent with existing animations in the app.

## Open Questions / Risks
- **Swipe Conflict**: Ensure `useSwipe` doesn't interfere with vertical scrolling. 
- **Mitigation**: Calculate `abs(deltaX) > abs(deltaY)` to confirm horizontal intent.

## Plan Updates
- Create `src/hooks/useSwipe.ts`.
- Refactor `src/features/daily-plan/DailyPlanView.tsx` to include `AnimatePresence` and `EditTitleDialog`.
