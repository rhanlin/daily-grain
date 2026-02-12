# Tasks: Redefine Task Completion Logic

**Input**: Design documents from `/specs/024-redefine-task-completion/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-actions.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create implementation plan and research documents (Completed)
- [x] T002 Update agent context with logic layer definitions (Completed)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic implementation in the repository layer

- [x] T003 Update `repository.subtasks.syncParentTaskStatus` in `src/lib/repository.ts` to implement the redefined Status Engine logic (FR-001, FR-005): (Completed)
- [x] T004 Update `repository.tasks.update` in `src/lib/repository.ts` to implement Manual DONE Sync (FR-006): (Completed)
- [x] T005 [P] Implement unit tests for the redefined `syncParentTaskStatus` logic in `src/lib/__tests__/repository.test.ts`, covering all transition matrix scenarios (SC-001, SC-002). (Completed)
- [x] T006 [P] Implement unit tests for the Manual DONE Sync logic in `src/lib/__tests__/repository.test.ts` (SC-004). (Completed)

**Checkpoint**: Core logic ready - Task status now correctly accounts for recurring types and manual overrides.

---

## Phase 3: User Story 1 - Automatic Completion Logic (Priority: P1) 🎯 MVP

**Goal**: Seamless automatic status transitions based on subtask progress.

**Independent Test**: Create a task with mixed one-time and multi-time subtasks. Complete them all and verify the parent task flips to DONE automatically.

### Implementation for User Story 1

- [x] T007 [US1] Ensure `repository.dailyPlan.toggleCompletion` calls the updated `syncParentTaskStatus` after every update (Trigger SC-003). (Completed)
- [x] T008 [US1] Ensure `repository.subtasks.create`, `repository.subtasks.update`, and `repository.subtasks.delete` trigger `syncParentTaskStatus` to handle dynamic reversion (FR-007). (Completed)
- [x] T009 [US1] Verify real-time UI updates when a Task transitions to DONE via `useLiveQuery` in `DailyPlanView.tsx` or `CategoryTaskDetail.tsx`. (Completed)

**Checkpoint**: User Story 1 functional - Automation is active and accurate according to new rules.

---

## Phase 4: User Story 2 - Manual Completion Override (Priority: P2)

**Goal**: Allow users to formally terminate tasks even with recurring items.

**Independent Test**: Create a task with a `daily` subtask. Manually mark the task as DONE. Verify it stays DONE and only one-time items were synced.

### Implementation for User Story 2

- [x] T010 [US2] Update Task management UI (if needed) to ensure the checkbox is available for all task types. (Completed)
- [x] T011 [US2] Add a confirmation dialog or warning in the UI when manually completing a Task that has unfinished recurring subtasks (FR-006 recommendation). (Completed)

**Checkpoint**: User Story 2 functional - Manual control is preserved and correctly synced.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup and final validation

- [x] T012 Verify SC-003 (Performance < 100ms) by benchmarking complex tasks with 10+ subtasks to ensure UI responsiveness. (Completed)
- [x] T013 Run `quickstart.md` validation scenarios. (Completed)
- [x] T014 Execute full test suite: `npm test`. (Completed)
- [x] T015 Final build check: `npm run build`. (Completed)

---

## Dependencies & Execution Order

1. **Phase 2 (Foundational)** is the primary blocker. Core logic MUST be in the repository before UI behavior can be verified.
2. **Phase 3 (US1)** depends on Phase 2 logic triggers.
3. **Phase 4 (US2)** can be worked on in parallel with Phase 3 if repository updates from T004 are complete.
4. **Phase 5** is the final wrap-up.
