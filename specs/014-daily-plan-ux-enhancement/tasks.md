---
description: "Task list for Daily Plan UX Enhancement"
---

# Tasks: Daily Plan UX Enhancement

**Input**: Design documents from `/specs/014-daily-plan-ux-enhancement/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual verification via Mobile DevTools is the primary validation strategy.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the gesture hook and prepare components.

- [x] T001 [P] Create custom swipe hook in `src/hooks/useSwipe.ts`
- [x] T002 Import `AnimatePresence` and `motion` from `framer-motion` in `src/features/daily-plan/DailyPlanView.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic for date manipulation.

- [x] T003 Implement `addDays` and `subDays` utility functions in `src/lib/utils.ts`

**Checkpoint**: Infrastructure ready for gesture integration.

---

## Phase 3: User Story 1 - 手勢切換日期 (Priority: P1) 🎯 MVP

**Goal**: Enable mobile users to swipe left/right to navigate dates with slide animations.

**Independent Test**: Swipe left on task list -> Date advances by 1 day with slide-in animation. Swipe right -> Date recedes by 1 day with slide-in animation.

### Implementation for User Story 1

- [x] T004 Integrate `useSwipe` hook into the main container in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T005 Implement `handleSwipeLeft` and `handleSwipeRight` to call `onDateChange` in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T006 Wrap the task list container with `AnimatePresence` and `motion.div` in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T007 Define slide `variants` (initial, animate, exit) using a `custom` direction prop in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T008 [P] Ensure vertical scroll is not blocked by horizontal swipe detection in `src/hooks/useSwipe.ts`

**Checkpoint**: Date navigation via swipe is functional with animations.

---

## Phase 4: User Story 2 - 編輯計畫項目標題 (Priority: P1)

**Goal**: Add "Edit Title" functionality to the item Drawer and update the database.

**Independent Test**: Click More icon -> Select "編輯標題" -> Dialog appears -> Update title -> List updates immediately.

### Implementation for User Story 2

- [x] T009 [P] Create `EditTitleDialog` component using Shadcn UI Dialog in `src/features/daily-plan/DailyPlanView.tsx` (or a sub-component)
- [x] T010 Add "編輯標題" button to the existing item `Drawer` in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T011 Implement `handleEditTitle` logic to populate and open the dialog in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T012 Implement `submitTitleUpdate` to call `repository.tasks.update` or `repository.subtasks.update` in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T013 [P] Add input validation to prevent empty titles in the Edit Dialog in `src/features/daily-plan/DailyPlanView.tsx`

**Checkpoint**: Title editing is fully functional for both Tasks and SubTasks.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: UX refinements and performance checks.

- [x] T014 Adjust animation duration and easing for a "physics-based" feel in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T015 Verify accessibility: ensure Dialog focus management works correctly in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T016 Run manual verification steps from `specs/014-daily-plan-ux-enhancement/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Must define `useSwipe` before Story 1 can proceed.
- **Foundational (Phase 2)**: Core logic for date change.
- **User Stories**: US1 and US2 can be implemented in parallel as they touch different parts of the UI (gesture wrapper vs drawer/dialog).

### Implementation Strategy

1.  **US1 First**: Implement gestures and animations as they provide the biggest UX impact.
2.  **US2 Second**: Expand the functional menu.
3.  **Validation**: Test on mobile emulator.