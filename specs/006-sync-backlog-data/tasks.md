---
description: "Task list for Backlog Data Synchronization Fix"
---

# Tasks: Backlog Data Synchronization Fix

**Input**: Design documents from `/specs/006-sync-backlog-data/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md.

**Architecture**: React 18+, Dexie.js (IndexedDB), dexie-react-hooks.
**Frontend**: Reactive UI components in the Daily Plan view.
**Testing**: Vitest, React Testing Library.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency verification.

- [x] T001 [P] Verify `dexie-react-hooks` dependency and `useLiveQuery` usage in `package.json`

---

## Phase 2: Foundational (Core Logic Refactor)

**Purpose**: Fix the root cause of the synchronization and filtering issues.

**⚠️ CRITICAL**: No UI work should proceed until the hook logic is corrected.

- [x] T002 Refactor `useBacklog` grouping logic to include all `TODO` tasks (even without subtasks) and strictly exclude archived categories/tasks in `src/hooks/useBacklog.ts`
- [x] T003 Standardize plan-based filtering (`planRefIds`) exclusively inside the hook in `src/hooks/useBacklog.ts`

**Checkpoint**: `useBacklog` correctly returns all standalone and subtask-bearing items.

---

## Phase 3: User Story 1 - Backlog Real-time Synchronization (Priority: P1) 🎯 MVP

**Goal**: Ensure the UI reflects the refactored data and responds to real-time changes.

**Independent Test**: Rename a category on the Home page and verify the name update in the Daily Plan Backlog slide immediately.

### Implementation for User Story 1

- [x] T004 [US1] Remove redundant `planRefIds` calculation and sync props with refactored hook in `src/features/daily-plan/BacklogContent.tsx`
- [x] T005 [US1] Update `CategorySlide` component to correctly render tasks that lack subtasks in `src/features/daily-plan/CategorySlide.tsx`
- [x] T006 [P] [US1] Add unit tests for `useBacklog` to verify standalone task inclusion, reactivity, and immediate removal upon data archival in `src/hooks/__tests__/useBacklog.test.ts`

**Checkpoint**: All types of tasks are visible and synced in real-time across views.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Performance verification and visual cleanup.

- [x] T007 [Polish] Audit transition performance when navigating between Home and Daily Plan in `src/pages/DailyPlanPage.tsx`
- [x] T008 [Polish] Verify visual consistency of Eisenhower badges in the Backlog view in `src/features/daily-plan/CategorySlide.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion.
- **Polish (Phase 4)**: Depends on US1 being complete.

### Parallel Opportunities

- T001 and T006 can run in parallel with other tasks.
- T007 can be started as soon as T004 is implemented.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Fix the `useBacklog` hook to stop excluding standalone tasks.
2. Update the UI components to render the new data structure.
3. **VALIDATE**: Ensure a task created on the Home page appears in the Backlog.

### Incremental Delivery

1. Centralize all filtering logic into the hook to prevent state drift.
2. Add regression tests to prevent "missing task" bugs in the future.