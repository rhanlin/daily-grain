---
description: "Task list for updating Eisenhower defaults"
---

# Tasks: Update Eisenhower Defaults

**Input**: Design documents from `/specs/013-update-eisenhower-defaults/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit tests for inheritance logic are required per SC-003.

**Organization**: Tasks are grouped by phase, with implementation focused on standardizing task defaults and implementing subtask inheritance.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and validation preparation.

- [x] T001 Create unit test file `src/lib/__tests__/repository.test.ts` if not exists

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Standardization of the repository layer for task creation.

- [x] T002 Update `repository.tasks.create` to ensure `eisenhower` defaults to 'Q4' in `src/lib/repository.ts`
- [x] T003 [P] Update `QuickCreateTaskDrawer.tsx` to use 'Q4' instead of 'Q2' for new tasks in `src/features/tasks/QuickCreateTaskDrawer.tsx`

**Checkpoint**: Task creation foundation ready.

---

## Phase 3: User Story 1 - 任務預設象限設定 (Priority: P1) 🎯 MVP

**Goal**: Ensure all new tasks default to Q4.

**Independent Test**: Create a task via drawer and repository, verify both are Q4.

### Implementation for User Story 1

- [x] T004 [US1] Add unit test case for `repository.tasks.create` default Q4 value in `src/lib/__tests__/repository.test.ts`
- [x] T005 [US1] Verify T004 test passes with current `repository.ts` changes

**Checkpoint**: User Story 1 functional and verified.

---

## Phase 4: User Story 2 - 子任務繼承象限設定 (Priority: P1)

**Goal**: Subtasks inherit parent task's Eisenhower value.

**Independent Test**: Create a subtask under a Q2 task, verify subtask is Q2.

### Tests for User Story 2

- [x] T006 [US2] Add unit test case for `repository.subtasks.create` inheritance logic in `src/lib/__tests__/repository.test.ts`
- [x] T007 [US2] Add unit test case for `repository.subtasks.create` fallback to 'Q4' when parent task is missing in `src/lib/__tests__/repository.test.ts`

### Implementation for User Story 2

- [x] T008 [US2] Modify `repository.subtasks.create` to be async and fetch parent task's Eisenhower value in `src/lib/repository.ts`
- [x] T009 [US2] Implement inheritance and fallback logic in `repository.subtasks.create` in `src/lib/repository.ts`
- [x] T010 [US2] Verify T006 and T007 tests pass

**Checkpoint**: User Story 2 functional and verified.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final review and cross-cutting checks.

- [x] T011 [P] Ensure all manual verification steps in `specs/013-update-eisenhower-defaults/quickstart.md` pass
- [x] T012 Run `npm test` to ensure no regressions in task/subtask hooks
