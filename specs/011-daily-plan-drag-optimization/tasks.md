---
description: "Task list for Daily Plan Drag Optimization"
---

# Tasks: Daily Plan Drag Optimization

**Input**: Design documents from `/specs/011-daily-plan-drag-optimization/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit tests for reordering logic required per constitution.

**Organization**: Tasks are grouped by phase, covering implementation gaps identified during research.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project state and prepare base components.

- [x] T001 Verify `dnd-kit` and `lucide-react` dependencies in `package.json`
- [x] T002 Verify `useMedia` hook availability in `src/hooks/` or `react-use`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Configure the sorting sensors and finalize baseline refactors.

- [x] T003 Calibrate `TouchSensor` activation constraints (delay: 150ms, tolerance: 5px) in `src/pages/DailyPlanPage.tsx`
- [x] T004 Identify all components using `useLongPress` for a global refactor audit

**Checkpoint**: Sensors are tuned; project is ready for handle-based triggers and conflict logic.

---

## Phase 3: User Story 1 - 順暢的手機版排序體驗 (Priority: P1) 🎯 MVP

**Goal**: Resolve the conflict between dragging and sorting modes by introducing explicit handles, buttons, and mode-based restrictions.

**Independent Test**: Enable "Sort by Matrix" and verify drag handles disappear. Disable it and verify dragging via handle works smoothly without opening Drawers.

### Core UI Implementation (Already in progress)

- [x] T005 [US1] Implement visual `GripVertical` handle in `src/components/dnd/DraggableTask.tsx`
- [x] T006 [US1] Restrict `dnd-kit` listeners and attributes to the handle element only in `src/components/dnd/DraggableTask.tsx`
- [x] T006b [P] [US1] Create unit tests for reordering state stability in `src/components/dnd/__tests__/DraggableTask.test.tsx`
- [x] T007 [P] [US1] Remove `useLongPress` hook and associated logic from `src/features/tasks/TaskItem.tsx`
- [x] T008 [US1] Add `MoreHorizontal` icon button to the right side of the card in `src/features/tasks/TaskItem.tsx`
- [x] T009 [US1] Map the `MoreHorizontal` click event to trigger the existing action Drawer in `src/features/tasks/TaskItem.tsx`
- [x] T010 [P] [US1] Remove `useLongPress` hook and associated logic from `src/features/tasks/SubTaskList.tsx`
- [x] T011 [US1] Add `MoreHorizontal` menu button to each subtask row in `src/features/tasks/SubTaskList.tsx`
- [x] T012 [US1] Ensure the `SubTaskRow` menu trigger behaves consistently with the main task card in `src/features/tasks/SubTaskList.tsx`

### Logic Conflict & Sync Implementation (Pending Gaps)

- [x] T021 [US1] Add `createdAt` field to Task/SubTask schema and migration in `src/lib/db.ts`
- [x] T022 [US1] Update repository to populate `createdAt` on creation in `src/lib/repository.ts`
- [x] T023 [US1] Update Category Detail UI to sort by `createdAt` in `src/features/tasks/CategoryTaskDetail.tsx`
- [ ] T016 [US1] Implement `disabled` prop in `DraggableTask` component to conditionally hide handle and listeners in `src/components/dnd/DraggableTask.tsx`
- [ ] T017 [US1] Pass `disabled={sortByMatrix}` from `DailyPlanView` to all item wrappers in `src/features/daily-plan/DailyPlanView.tsx`
- [ ] T018 [US1] Explicitly set container ID to `'daily-plan'` in `SortableContext` to align with page handlers in `src/features/daily-plan/DailyPlanView.tsx`
- [ ] T019 [P] [US1] Update unit tests to verify handle visibility toggle based on `disabled` state in `src/components/dnd/__tests__/DraggableTask.test.tsx`
- [ ] T019b [P] [US1] Create unit tests for container ID and conflict mode synchronization in `src/features/daily-plan/__tests__/DailyPlanView.test.tsx`

**Checkpoint**: Mobile reordering is handle-only and disabled during matrix sort. Container IDs are synced.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Ensure global consistency and verify against spec.

- [x] T013 Global audit: ensure NO components in the project still rely on `useLongPress` for primary actions
- [x] T014 [P] Final CSS check: ensure the `DragHandle` and `MoreHorizontal` icons are accessible and correctly aligned on small screens
- [ ] T020 Run manual verification steps from `specs/011-daily-plan-drag-optimization/quickstart.md` including the Matrix Sort conflict check.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1-3**: Core implementation path.
- **T016-T018**: These are the missing pieces preventing reordering from working correctly today.

### User Story Dependencies

- **User Story 1 (P1)**: The primary goal.

### Parallel Opportunities

- T016 and T019 can be done in parallel once the prop interface is defined.

---

## Implementation Strategy

### Incremental Delivery (Conflict Resolution)

1.  **Enable Container ID**: Fix the immediate reorder failure by aligning IDs.
2.  **Conditional Dragging**: Add the `disabled` logic to prevent matrix sort conflicts.
3.  **Validate**: Ensure reordering works in manual mode and is disabled in auto mode.