---
description: "Task list for Daily Plan Drag Optimization"
---

# Tasks: Daily Plan Drag Optimization

**Input**: Design documents from `/specs/011-daily-plan-drag-optimization/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit tests for reordering state and conflict handling are required to satisfy Constitution Principle I.

**Organization**: Tasks are grouped by user story, prioritizing the resolution of gesture and logical conflicts.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project state and prepare base utilities.

- [x] T001 Verify `dnd-kit` and `lucide-react` dependencies in `package.json`
- [x] T002 Verify `useMedia` hook availability in `src/hooks/` or `react-use`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Calibrate sensors and define the drag interface.

- [x] T003 Calibrate `TouchSensor` activation constraints (delay: 150ms, tolerance: 5px) in `src/pages/DailyPlanPage.tsx`
- [x] T004 Implement `disabled` prop and conditional handle rendering in `src/components/dnd/DraggableTask.tsx`
- [x] T005 Create unit tests for `DraggableTask` handle visibility and `disabled` state in `src/components/dnd/__tests__/DraggableTask.test.tsx`

**Checkpoint**: Base components support conditional dragging; sensors are tuned.

---

## Phase 3: User Story 1 - 順暢的手機版排序體驗 (Priority: P1) 🎯 MVP

**Goal**: Resolve reordering conflicts by aligning container IDs, disabling drag during matrix sort, and migrating to explicit menu triggers.

**Independent Test**: Enable "Sort by Matrix" -> drag handles disappear. Disable it -> drag works. Click "..." -> Drawer opens.

### Logic & Conflict Implementation

- [x] T006 [US1] Explicitly set container ID to `'daily-plan'` in `SortableContext` in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T007 [US1] Pass `disabled={sortByMatrix}` to `PlanItemWrapper` and its `DraggableTask` child in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T008 [US1] Map `MoreHorizontal` clicks to `setActionItem` in `DailyPlanView.tsx` (ensure listeners don't conflict with DnD)
- [x] T009 [P] [US1] Unit test for `DailyPlanView` conflict mode synchronization in `src/features/daily-plan/__tests__/DailyPlanView.test.tsx`

### Global Gesture Refactor

- [x] T010 [P] [US1] Global removal of `useLongPress` hook from `src/features/tasks/TaskItem.tsx`
- [x] T011 [US1] Add explicit `MoreHorizontal` button to `src/features/tasks/TaskItem.tsx` for mobile menu access
- [x] T012 [P] [US1] Global removal of `useLongPress` hook from `src/features/tasks/SubTaskList.tsx`
- [x] T013 [US1] Add explicit `MoreHorizontal` button to `src/features/tasks/SubTaskList.tsx` for subtask row actions
- [x] T014 [US1] Refactor `src/features/categories/CategoryCard.tsx` to use `MoreHorizontal` icon button instead of custom long-press logic
- [x] T018 [US1] Implement DB schema migration to add `createdAt` to Task and SubTask in `src/lib/db.ts`
- [x] T019 [US1] Update repository to populate `createdAt` on creation in `src/lib/repository.ts`
- [x] T020 [US1] Update Category Detail UI to sort by `createdAt` in `src/features/tasks/CategoryTaskDetail.tsx`
- [x] T021 [US1] Implement `DragOverlay` for visual reordering preview in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T022 [US1] Add tactile vibration feedback (`navigator.vibrate`) on drag start in `src/components/dnd/DraggableTask.tsx`

**Checkpoint**: All gesture conflicts resolved; sorting is stable and follows the active mode.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and styling adjustments.

- [x] T015 Run manual verification steps from `specs/011-daily-plan-drag-optimization/quickstart.md`
- [x] T016 [P] CSS Audit: Ensure `DragHandle` and `MoreHorizontal` button alignment is consistent across all card types
- [x] T017 Final build verification: `npm run build` to ensure no regression in PWA manifest or assets

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 2** is a prerequisite for **Phase 3**.
- **T006-T007** are high-priority as they fix the immediate reordering failure.

### Parallel Opportunities

- T009, T010, and T012 can be implemented in parallel.
- CSS Audit (T016) can run alongside final manual tests.

---

## Implementation Strategy

### MVP First (Conflict Fix)

1.  **Fix Logic**: Synchronize container IDs and disable handles during matrix sort.
2.  **Remove Conflict**: Replace long-press with buttons in the Daily Plan first.
3.  **Refactor Rest**: Apply the button-menu pattern to Category and Task List views.
