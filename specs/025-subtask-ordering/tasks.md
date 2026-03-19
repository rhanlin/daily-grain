# Tasks: SubTask Chronic Ordering

**Input**: Design documents from `/specs/025-subtask-ordering/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-actions.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Update `src/lib/db.ts` to ensure `createdAt` and `updatedAt` are correctly indexed for subtasks (Verify existing schema v4)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic and shared utilities for sorting

- [x] T002 Implement `subtaskComparator` logic in `src/lib/repository.ts` incorporating the fallback logic (createdAt -> updatedAt -> id)
- [x] T003 Update `repository.subtasks.getByTask` in `src/lib/repository.ts` to use `sortBy('createdAt')` or the manual comparator for consistency

**Checkpoint**: Foundational logic ready - Sorting algorithm is defined and repository is prepared.

---

## Phase 3: User Story 1 - Stable Task Detail & Matrix Ordering (Priority: P1) 🎯 MVP

**Goal**: Ensure subtasks appear in a stable, chronological order in the main views.

**Independent Test**: Create subtasks A, B, C; verify they stay in that order in Task Detail and Matrix view across refreshes.

### Implementation for User Story 1

- [x] T004 [P] [US1] Update `src/features/tasks/EisenhowerMatrix.tsx` to sort subtasks using `db.subtasks.orderBy('createdAt').toArray()` or the shared comparator
- [x] T005 [P] [US1] Ensure `src/features/tasks/CategoryTaskDetail.tsx` (or equivalent component) displays subtasks using the repository's sorted fetch
- [x] T006 [US1] Implement unit tests for `subtaskComparator` in `src/lib/__tests__/repository.test.ts` to verify fallback and tie-breaker logic

**Checkpoint**: User Story 1 functional - Basic stable ordering is active in primary views.

---

## Phase 4: User Story 2 - Grouped Backlog Ordering (Priority: P1)

**Goal**: Maintain task grouping and chronological order within the Backlog carousel.

**Independent Test**: View Backlog; verify subtasks from the same task are adjacent and ordered by time.

### Implementation for User Story 2

- [x] T007 [US2] Update `useBacklog` hook in `src/hooks/useBacklog.ts` to group subtasks by `taskId` and sort within groups using `subtaskComparator`
- [x] T008 [US2] Verify carousel UI in `src/features/daily-plan/BacklogContent.tsx` handles the grouped/sorted data without layout shifts

**Checkpoint**: User Story 2 functional - Backlog display is now organized and predictable.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and documentation

- [x] T009 [P] Run manual verification scenarios from `specs/025-subtask-ordering/quickstart.md`
- [x] T010 Execute full test suite: `npm test`
- [x] T011 Final build check: `npm run build`

---

## Dependencies & Execution Order

1. **Foundational (Phase 2)** must be completed before any User Story.
2. **User Story 1** and **User Story 2** can be implemented in parallel if repository logic is stable.
3. **Phase 5** follows implementation completion.

## Parallel Execution Examples

- **US1**: T004 and T005 can be done simultaneously.
- **Cross-cutting**: T006 (tests) can be written while T004/T005 are being implemented.

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 2.
2. Implement Phase 3 (US1).
3. **STOP and VALIDATE**: Verify stable ordering in Task Detail.

### Incremental Delivery
1. Add US2 (Backlog Grouping) to polish the carousel experience.
2. Final validation across all views.
