# Tasks: SubTask Types and Recurring Logic

**Input**: Design documents from `/specs/022-subtask-recurring-types/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-actions.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create implementation plan and research documents (Completed)
- [x] T002 Update agent context with new technical requirements (Completed)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T003 Update `src/lib/db.ts` to Version 4:
    - Add `type` and `repeatLimit` to `SubTask` interface and schema.
    - Add `isCompleted` to `DailyPlanItem` interface and schema.
    - Implement `upgrade` logic to populate `isCompleted` for existing items.
- [x] T004 Update `repository.subtasks.create` in `src/lib/repository.ts` to support optional `type` and `repeatLimit` parameters.
- [x] T005 [P] Update `repository.dailyPlan.add` in `src/lib/repository.ts` to initialize `isCompleted: false`.
- [x] T006 Implement `repository.dailyPlan.toggleCompletion` in `src/lib/repository.ts` to handle decoupling logic for multi-time/daily tasks.
- [x] T006.1 [P] Handle type-switching edge cases in `repository.subtasks.update` (e.g., clearing `repeatLimit` when reverting to 'one-time').
- [x] T007 [P] Create unit tests for Schema v4 migration and repository logic in `src/lib/__tests__/repository.test.ts`.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Create SubTask with Type Selection (Priority: P1) 🎯 MVP

**Goal**: Allow users to choose between One-time, Multi-time, or Daily types during subtask creation.

**Independent Test**: Open Add SubTask form, verify "One-time" is default, and "Multi-time" reveals a limit input.

### Implementation for User Story 1

- [x] T008 [P] [US1] Add `type` and `repeatLimit` fields to `useSubTask` hook in `src/hooks/useSubTask.ts`.
- [x] T009 [US1] Update `SubTaskList.tsx` UI:
    - Add a Select component for SubTask type.
    - Add a conditional Input component for `repeatLimit` (only for Multi-time).
- [x] T010 [US1] Update subtask creation and edit logic in `SubTaskList.tsx` to pass new fields to repository.
- [x] T011 [US1] Add unit tests for `useSubTask` hook updates in `src/hooks/__tests__/useSubTask.test.ts`.

**Checkpoint**: User Story 1 functional - Type selection works.

---

## Phase 4: User Story 2 - Track Progress for Multi-time SubTasks (Priority: P2)

**Goal**: Display completion progress (e.g., 1/3) for multi-time tasks in Daily Plan and Backlog.

**Independent Test**: Create a multi-time task (limit 2), add to two days, mark one as done, verify "1/2" appears in both views.

### Implementation for User Story 2

- [x] T012 [US2] Implement progress calculation logic in `src/hooks/useSubTask.ts` using indexed collection filtering on `DailyPlanItem.refId` to ensure SC-002 performance.
- [x] T013 [US2] Update `SubTaskList.tsx` row rendering to display progress badge for non-one-time tasks.
- [x] T014 [US2] Update `DailyPlanView.tsx` (`PlanSubTaskItem`) to display progress text next to the subtask title.
- [x] T015 [US2] Add visual alert (red text) for progress exceeding limit in `SubTaskList.tsx` and `DailyPlanView.tsx` (Ensuring FR-009 compliance).
- [x] T016 [US2] Update Backlog rendering (find component via `useBacklog`) to display progress.

**Checkpoint**: User Story 2 functional - Progress is tracked and displayed.

---

## Phase 5: User Story 3 - Identify Daily Tasks (Priority: P3)

**Goal**: Distinguish Daily tasks with a specific visual indicator (Infinity icon).

**Independent Test**: Create a Daily task and verify the Infinity (∞) icon appears in Backlog and Daily Plan.

### Implementation for User Story 3

- [x] T017 [P] [US3] Add Infinity icon (from `lucide-react`) to non-one-time indicators in `SubTaskList.tsx`.
- [x] T018 [P] [US3] Add Infinity icon to `PlanSubTaskItem` in `DailyPlanView.tsx`.

**Checkpoint**: User Story 3 functional - Daily tasks are visually distinct.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup and final validation

- [x] T019 Update `src/hooks/useDailyPlan.ts` to handle reactive updates of `isCompleted` from the plan items table.
- [x] T020 Code cleanup: Remove any remaining direct coupling between `DailyPlanItem` and `SubTask.isCompleted` for recurring types.
- [x] T021 Run `quickstart.md` validation steps.
- [x] T022 Execute full test suite: `npm test`.
- [x] T023 Final build check: `npm run build`.

---

## Dependencies & Execution Order

1. **Phase 2 (Foundation)** MUST be completed first as it updates the DB Schema.
2. **Phase 3 (US1)** implements the creation UI, which is necessary to create tasks for testing US2 and US3.
3. **Phase 4 & 5** can be implemented in parallel after Phase 3.
4. **Phase 6** is the final wrap-up.
