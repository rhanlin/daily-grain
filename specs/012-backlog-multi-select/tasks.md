---
description: "Task list for Backlog Multi-Select"
---

# Tasks: Backlog Multi-Select

**Input**: Design documents from `/specs/012-backlog-multi-select/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit tests for selection logic and batch insertion are required to satisfy Constitution Principle I.

**Organization**: Tasks are grouped by phase, with the core implementation focused on the Category-level Batch Adding story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project state and prepare base types.

- [x] T001 Verify `react-use` dependency in `package.json`
- [x] T002 Define `MultiSelectState` interface in `src/features/daily-plan/BacklogContent.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement state management and prop structures.

- [x] T003 Implement `activeCategoryId` and `selectedIds` state in `src/features/daily-plan/BacklogContent.tsx`
- [x] T004 Define and pass selection props down from `BacklogContent` to `CategorySlide` (and drill to `BacklogTaskItem`, `DraggableItem`) in `src/features/daily-plan/BacklogContent.tsx`
- [x] T005 Update `BacklogTaskItem` and `DraggableItem` prop types in `src/features/daily-plan/CategorySlide.tsx` to handle selection state

**Checkpoint**: Selection plumbing is in place; ready for UI and interaction logic.

---

## Phase 3: User Story 1 - 跨任務批次新增子任務 (Priority: P1) 🎯 MVP

**Goal**: Enable long-press to select subtasks within a category and batch-add them via footer action.

**Independent Test**: Long-press subtask in Cat A -> Footer appears. Select items in Cat A -> Footer updates. Slide to Cat B -> Cat B is locked. Click Add -> Items appear in plan.

### Gesture & Selection UI

- [x] T006 Integrate `useLongPress` in `DraggableItem` component in `src/features/daily-plan/CategorySlide.tsx`
- [x] T007 Implement circular selection `Checkbox` and ring-highlight UI in `DraggableItem` in `src/features/daily-plan/CategorySlide.tsx`
- [x] T008 Implement `isLocked` visual state (dimming/grayscale) for non-active categories in `src/features/daily-plan/CategorySlide.tsx`

### Batch Action Logic

- [x] T009 Implement the fixed `MultiSelectFooter` component in `src/features/daily-plan/BacklogContent.tsx`
- [x] T010 Implement `batchAddToPlan` logic using `useDailyPlan` hook in `src/features/daily-plan/BacklogContent.tsx`
- [x] T011 Add reset and cancellation logic to restore normal mode in `src/features/daily-plan/BacklogContent.tsx`

### Validation (Principle I)

- [ ] T012 [P] [US1] Create unit tests for selection state machine and category locking in `src/features/daily-plan/__tests__/BacklogSelection.test.tsx`

**Checkpoint**: Category-level multi-selection is fully functional and verified.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: UI refinements and final build check.

- [ ] T013 Ensure haptic feedback (`navigator.vibrate`) works on long-press in `src/features/daily-plan/CategorySlide.tsx`
- [ ] T014 [P] Final CSS audit: Ensure footer doesn't overlap content when scrolled in `src/features/daily-plan/BacklogContent.tsx`
- [ ] T015 Run manual verification steps from `specs/012-backlog-multi-select/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 2** must be complete before UI work in **Phase 3**.
- **T006-T008** (UI) and **T009-T011** (Action Logic) can proceed in parallel.

### Implementation Strategy

1.  **State Logic**: Fix `activeCategoryId` logic first.
2.  **Interaction**: Hook up long-press and checkboxes.
3.  **Finalize**: Build the footer and batch insertion.