# Tasks: Task/Sub-task Cleanup Sync

**Feature Name**: Task/Sub-task Cleanup Sync
**Plan**: [specs/020-fix-cleanup-subtasks/plan.md](plan.md)
**Status**: Ready for Implementation

## Implementation Strategy
We will follow an MVP-first approach, starting with the critical data integrity issue (cascading deletes) before moving to the UX improvement (archival filtering). Each phase includes automated tests to ensure correctness and prevent regressions.

## Dependencies
- US1 (Cascading Delete) is foundational and should be completed first.
- US2 (Archival Filtering) depends on the task status field but is logically independent of US1's deletion logic.

## Parallel Execution Examples
- [US1] Repository implementation (T003) and Test preparation (T002) can be started in parallel if separate developers are involved.
- [US2] Hook updates for Backlog (T006) and Sub-tasks (T007) are parallelizable.

---

## Phase 1: Setup
**Goal**: Prepare the environment and ensure current state is stable.

- [x] T001 Verify existing task/sub-task tests pass in `src/lib/__tests__/repository.test.ts`

---

## Phase 2: Cascading Delete (US1)
**Goal**: Implement hard delete cascade to remove orphaned sub-tasks and daily plan items.
**Independent Test**: Use `quickstart.md` Step 1 and Step 3 to verify cascading deletion.

- [x] T002 [US1] Create unit tests for cascading delete in `src/lib/__tests__/repository.test.ts`
- [x] T003 [US1] Update `deleteTask` in `src/lib/repository.ts` to use a Dexie transaction for cascading deletes of sub-tasks and daily plan items
- [x] T004 [US1] Ensure `deleteSubTask` in `src/lib/repository.ts` also cleans up its own `DailyPlanItem` references
- [x] T005 [US1] Verify T002 tests pass and manual verification of cascading delete succeeds

---

## Phase 3: Archival Filtering (US2)
**Goal**: Filter out sub-tasks of archived tasks from active views without deleting them.
**Independent Test**: Use `quickstart.md` Step 2 to verify sub-tasks of archived tasks are hidden from the Backlog.

- [x] T006 [P] [US2] Update `useBacklog` hook in `src/hooks/useBacklog.ts` to filter out sub-tasks whose parent task status is 'ARCHIVED'
- [x] T007 [P] [US2] Update `useSubTask` hook in `src/hooks/useSubTask.ts` to exclude sub-tasks of archived tasks from active queries
- [x] T008 [US2] Update `useDailyPlan` hook or related filtering logic in `src/hooks/useDailyPlan.ts` to ensure archived tasks' sub-tasks are hidden
- [x] T009 [US2] Add unit tests for archival filtering logic in `src/hooks/__tests__/` (if existing) or verify via UI integration

---

## Phase 4: Polish & Final Verification
**Goal**: Ensure overall system stability and consistent UX.

- [x] T010 Perform full regression test of the Daily Plan and Backlog Drawer using `quickstart.md`
- [x] T011 Run `npm run lint` and `npm test` to ensure project standards are met
- [x] T012 Final code review for adherence to "DailyGrain 專案憲章" (Constitution)
