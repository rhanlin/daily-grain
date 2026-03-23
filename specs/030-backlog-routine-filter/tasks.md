# Tasks: Backlog Routine Filter

**Input**: Design documents from `/specs/030-backlog-routine-filter/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-actions.md

## Phase 1: Setup

**Purpose**: Verify dependencies and initial structure.

- [x] T001 [P] Verify availability of `Switch` and `Label` from Shadcn UI in `src/components/ui/`

---

## Phase 2: Foundational

**Purpose**: Implement the core filtering logic.

- [x] T002 [P] Implement `filterBacklogGroups` utility function in `src/features/daily-plan/BacklogLogic.ts` (or appropriate logic file) based on `data-model.md` rules
- [x] T003 Create unit tests for `filterBacklogGroups` in `src/features/daily-plan/__tests__/BacklogLogic.test.ts` ensuring `daily` tasks and empty categories are handled correctly

**Checkpoint**: Core filtering logic is verified and ready for UI integration.

---

## Phase 3: User Story 1 - 在待辦清單中隱藏例行任務 (Priority: P1) 🎯 MVP

**Goal**: Add the filter toggle to the Backlog UI and connect it to the filtering logic.

**Independent Test**: Open Backlog, toggle "隱藏每日", verify `daily` tasks disappear and reappear when toggled back.

### Implementation for User Story 1

- [x] T004 [US1] Add `hideRoutine` state using `useState` in `src/features/daily-plan/Backlog.tsx` (default `false`)
- [x] T005 [US1] Integrate `Switch` and `Label` UI into the header area of `src/features/daily-plan/Backlog.tsx`
- [x] T006 [US1] Apply `filterBacklogGroups` logic to the data returned by `useBacklog` before rendering groups in `src/features/daily-plan/Backlog.tsx`

**Checkpoint**: Backlog filtering is functional within the drawer.

---

## Phase 4: User Story 2 - 過濾狀態的一致性或獨立性 (Priority: P2)

**Goal**: Ensure the state is independent and resets as per requirements.

**Independent Test**: Toggle main page filter, open Backlog, verify it starts at default (OFF). Close and reopen Backlog, verify it resets to default (OFF).

### Implementation for User Story 2

- [x] T007 [US2] Verify `Backlog.tsx` state management naturally resets on drawer close (due to unmounting)
- [x] T008 [US2] Manual verification: Ensure toggling filter in `Backlog.tsx` does not trigger re-renders or state changes in `DailyPlanView.tsx`

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final audit and verification.

- [x] T009 Perform manual verification of all scenarios in `specs/030-backlog-routine-filter/quickstart.md`
- [x] T010 [P] Performance Check: Ensure filter toggle response time is < 100ms (SC-001) using Chrome DevTools
- [x] T011 Strict type audit: Eliminate any implicit `any` introduced in `Backlog.tsx` or related components
- [x] T012 Final build check: `npm run build`

---

## Dependencies & Execution Order

1. **Phase 2** (Logic) must be completed before UI integration in **Phase 3**.
2. **Phase 3** (MVP) delivers the primary user value.
3. **Phase 4** validates the behavioral constraints (independence/reset).
4. **Phase 5** ensures production readiness.

## Parallel Execution Examples

- **Setup & Foundational**: T001 and T002 can be started simultaneously.
- **Foundational**: T002 (Implementation) and T003 (Tests) can be developed in parallel if the interface is agreed upon.

## Implementation Strategy

### MVP First
1. Complete logic implementation and testing (Phase 2).
2. Integrate basic toggle into the Backlog drawer (Phase 3).
3. Validate SC-001 and SC-003 immediately.

### Verification Focus
- Ensure category headers disappear when all their items are filtered out (FR-003).
- Verify the "Independent State" constraint by switching back and forth between main view and backlog.
