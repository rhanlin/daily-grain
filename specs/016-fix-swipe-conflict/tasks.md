---
description: "Task list for fixing swipe conflict with overlays"
---

# Tasks: Fix Swipe Conflict with Overlays

**Input**: Design documents from `/specs/016-fix-swipe-conflict/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual verification via Mobile DevTools is the primary validation strategy.

**Organization**: Tasks are grouped by phase, focusing on the core bug fix for background navigation conflict.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Hook Enhancement)

**Purpose**: Prepare the gesture hook to handle conditional disabling.

- [x] T001 Update `UseSwipeOptions` interface to include `disabled?: boolean` in `src/hooks/useSwipe.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement the blocking logic in the core gesture hook.

- [x] T002 Update `onTouchStart` and `onTouchEnd` in `src/hooks/useSwipe.ts` to return early if `disabled` is true
- [x] T002b [P] Create unit tests for `useSwipe` hook (test normal and disabled states) in `src/hooks/__tests__/useSwipe.test.ts`

**Checkpoint**: Hook is now capable of being disabled; ready for integration.

---

## Phase 3: User Story 1 - 防止背景滑動 (Priority: P1) 🎯 MVP

**Goal**: Disable background date navigation when a Dialog or Drawer is open.

**Independent Test**: Open any Drawer or Dialog in Daily Plan -> Attempt swipe -> Verify background date does not change.

### Implementation for User Story 1

- [x] T003 Derive `isOverlayOpen` state (from `isEditing || !!actionItem`) in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T004 Pass `disabled: isOverlayOpen` to the `useSwipe` hook call in `src/features/daily-plan/DailyPlanView.tsx`

**Checkpoint**: Conflict resolved; overlays now correctly block background gestures.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup and final verification.

- [x] T005 Run manual verification steps from `specs/016-fix-swipe-conflict/quickstart.md` and confirm all Success Criteria (SC-001 to SC-003) are met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** must be completed first to allow the type change.
- **Foundational (Phase 2)** must be completed to enable the feature in the hook.
- **User Story 1 (Phase 3)** integrates the change into the UI.

### Implementation Strategy

1.  **Lower-level first**: Update the shared hook logic.
2.  **UI Integration**: Connect the state in the view component.
3.  **Validate**: Perform manual testing on mobile emulation.