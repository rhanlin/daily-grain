# Tasks: Daily Plan Quick Add (UX First)

**Input**: Design documents from `/specs/027-daily-plan-quick-add/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-actions.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure baseline components are available

- [x] T001 [P] Verify UI components (Drawer, Input, Select, Switch, Label) in `src/components/ui/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data logic and automated tests

- [x] T002 Implement `repository.subtasks.quickCreate` with automatic Category/Task fallback logic in `src/lib/repository.ts`
- [x] T003 Create unit tests for `quickCreate` fallback and scheduling logic in `src/lib/__tests__/repository.test.ts`

**Checkpoint**: Foundational logic ready - Subtasks can be created and scheduled safely without manual parent task creation.

---

## Phase 3: User Story 1 - 快捷新增單一子任務 (Priority: P1) 🎯 MVP

**Goal**: Implement the primary entry points for both Mobile and Desktop.

**Independent Test**: Use the Speed Dial on mobile or Sidebar Input on desktop to add a task; verify it appears in the plan list.

### Implementation for User Story 1

- [x] T004 [P] [US1] Create `src/features/daily-plan/DailyPlanSpeedDial.tsx` with Framer Motion staggered animations and backdrop blur
- [x] T005 [P] [US1] Create `src/features/daily-plan/QuickAddTaskDrawer.tsx` mobile UI skeleton with title input
- [x] T006 [P] [US1] Create `src/features/daily-plan/DesktopQuickAdd.tsx` for desktop sidebar minimalist input
- [x] T007 [US1] Refactor `src/pages/DailyPlanPage.tsx` to replace the overlapping FAB with `DailyPlanSpeedDial` and integrate `QuickAddTaskDrawer`
- [x] T008 [US1] Integrate `DesktopQuickAdd` at the top of the sidebar in `src/pages/DailyPlanPage.tsx`

**Checkpoint**: US1 functional - Mobile FAB conflict resolved and basic quick add active on all platforms.

---

## Phase 4: User Story 2 - 選擇所屬分類與任務 (Priority: P2)

**Goal**: Support organization during quick creation.

**Independent Test**: Change category/task in the Drawer and verify the new subtask is correctly parented.

### Implementation for User Story 2

- [x] T009 [US2] Add Category and Task selectors with reactive filtering to `src/features/daily-plan/QuickAddTaskDrawer.tsx`

---

## Phase 5: User Story 3 - 連續新增模式 (Priority: P3)

**Goal**: High-speed planning efficiency.

**Independent Test**: Enable Continuous Mode, add multiple items without the UI closing.

### Implementation for User Story 3

- [x] T010 [US3] Implement "連續新增" toggle and logic (clear input + re-focus) in `src/features/daily-plan/QuickAddTaskDrawer.tsx`
- [x] T011 [US3] Ensure Enter key triggers submission in both `DesktopQuickAdd.tsx` and `QuickAddTaskDrawer.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Feedback, Stability, and Quality Audit

- [x] T012 [P] Implement `navigator.vibrate` feedback on successful submission in `src/features/daily-plan/QuickAddTaskDrawer.tsx`
- [x] T013 Run manual verification scenarios from `specs/027-daily-plan-quick-add/quickstart.md`
- [x] T014 [P] Strict type audit: Eliminate `any` in all new components (`DailyPlanSpeedDial`, `DesktopQuickAdd`, etc.) per Constitution Principle I
- [x] T015 [P] Final build check: `npm run build`

---

## Dependencies & Execution Order

1. **Foundational (Phase 2)** must be completed before UI work.
2. **User Story 1 (Phase 3)** is the MVP and must be stable before P2/P3.
3. **Phase 6** is the final wrap-up and quality gate.

## Parallel Execution Examples

- **Setup**: T001 can be checked anytime.
- **US1 UI**: T004, T005, and T006 can be developed in parallel as they are different components.

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete `quickCreate` logic.
2. Resolve the Mobile FAB conflict with `DailyPlanSpeedDial`.
3. Add the Desktop sidebar input.
4. **STOP and VALIDATE**: Test basic creation on both screen sizes.

### Incremental Delivery
1. Add pickers (US2) to the Drawer.
2. Add Continuous Mode (US3).
3. Apply haptics and animations polish.
