# Tasks: Fix Task Completion Status Sync

**Input**: Design documents from `/specs/021-fix-task-status-sync/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/repository.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify current state and prepare for changes.

- [X] T001 Verify existing test suite passes using `npm test`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic for parent task status rollup and strict enforcement.

- [X] T002 Implement `syncParentTaskStatus(taskId: string)` helper in `src/lib/repository.ts`
- [X] T003 Update `repository.tasks.update` to enforce strict subtask check (FR-006) in `src/lib/repository.ts`

---

## Phase 3: User Story 1 - Add incomplete subtask to a DONE task (Priority: P1) 🎯 MVP

**Goal**: Ensure a DONE parent task reverts to "TODO" when a new incomplete subtask is added.

**Independent Test**: Create a task, mark all existing subtasks as done (verify task is DONE), add a new subtask, verify task is now TODO.

### Tests for User Story 1

- [X] T004 [P] [US1] Create unit test for adding subtasks to a DONE task in `src/lib/__tests__/repository.test.ts`
- [X] T005 [P] [US1] Create unit test for strict enforcement (blocking manual DONE) in `src/lib/__tests__/repository.test.ts`

### Implementation for User Story 1

- [X] T006 [US1] Update `repository.subtasks.create` to call `syncParentTaskStatus` in `src/lib/repository.ts`

**Checkpoint**: User Story 1 is functional and verified by tests.

---

## Phase 4: User Story 2 - Sync on Update & Delete (Priority: P2)

**Goal**: Ensure status remains correct when subtasks are updated or deleted, including edge cases.

**Independent Test**: Add a completed subtask to a DONE task (stays DONE); Delete the only incomplete subtask (transitions to DONE).

### Tests for User Story 2

- [X] T007 [P] [US2] Create unit test for updating subtasks and its effect on parent task in `src/lib/__tests__/repository.test.ts`
- [X] T008 [P] [US2] Create unit test for deleting subtasks and its effect on parent task in `src/lib/__tests__/repository.test.ts`

### Implementation for User Story 2

- [X] T009 [US2] Update `repository.subtasks.update` to use centralized `syncParentTaskStatus` in `src/lib/repository.ts`
- [X] T010 [US2] Update `repository.subtasks.delete` to call `syncParentTaskStatus` in `src/lib/repository.ts`

**Checkpoint**: All status transitions (create/update/delete) are synchronized via the repository.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Clean up redundant logic and verify end-to-end integration.

- [X] T011 [P] Remove redundant parent sync logic from `updateSubTask` in `src/hooks/useSubTask.ts`
- [X] T012 [P] Update unit tests in `src/hooks/__tests__/useSubTask.test.ts` to reflect the logic shift to repository
- [X] T013 Run all tests and perform manual validation as described in `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion.
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion. Can run in parallel with US1.
- **Polish (Phase 5)**: Depends on Phase 3 and 4 completion.

### Parallel Opportunities

- T004, T005, T007, T008 (Tests) can be drafted in parallel.
- T011, T012 (Cleanup) can be done in parallel once implementation is stable.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2 (Foundational logic & Strict Enforcement).
2. Complete Phase 3 (US1 - Bug fix for creation & validation).
3. Validate: The reported bug is fixed and strict synchronization is active.

### Incremental Delivery

1. Foundation: Centralized sync helper and Task update guard.
2. Fix Creation (US1).
3. Refactor Update/Delete (US2) to use centralized helper for consistency.
4. Clean up Hook layer.
