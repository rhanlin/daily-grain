# Tasks: Daily Plan Gestures & Filters (UX Optimized)

**Input**: Design documents from `/specs/028-move-subtask-filter-daily/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-actions.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify and prepare UI components

- [x] T001 [P] Verify availability of `Switch` and `Button` components in `src/components/ui/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic for filtered reordering and atomic updates

- [x] T002 [P] Implement `repository.dailyPlan.moveItemToDate` in `src/lib/repository.ts` to handle atomic date updates and index calculation
- [x] T003 [P] Implement `reorderFiltered` helper in `src/features/daily-plan/DragLogic.ts` using virtual-to-real index mapping

**Checkpoint**: Foundational logic ready - Repository supports cross-date moves and filtered reordering.

---

## Phase 3: User Story 2 - 例行性任務過濾器 (Priority: P1)

**Goal**: Hide daily tasks while maintaining stable sorting for visible items.

**Independent Test**: Enable the filter; daily tasks disappear. Reorder visible tasks and verify the absolute order is correct upon disabling the filter.

### Implementation for User Story 2

- [x] T004 [P] [US2] Add "隱藏每日任務" toggle switch to `src/features/daily-plan/PlanToolbar.tsx`
- [x] T005 [US2] Implement `hideRoutine` state and filter logic in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T006 [US2] Update reorderItems call in `src/features/daily-plan/DailyPlanView.tsx` to use the filtered reorder algorithm
- [x] T007 [US2] Create unit tests for `reorderFiltered` in `src/lib/__tests__/repository.test.ts`

**Checkpoint**: User Story 2 functional - Routine filter is active with stable persistence.

---

## Phase 4: User Story 1 - 手勢拖曳移動日期 (Priority: P1) 🎯 MVP

**Goal**: Implement side guide panels for intuitive cross-date gestural movement.

**Independent Test**: Drag a task to the screen edge; verify side panel appears; hover for 500ms to see date switch; drop to move task.

### Implementation for User Story 1

- [x] T008 [P] [US1] Create `src/features/daily-plan/SideGuidePanels.tsx` with Framer Motion staggered animations and `useDroppable` zones
- [x] T009 [US1] Integrate `SideGuidePanels` into `src/features/daily-plan/DailyPlanView.tsx` controlled by `activeId` state
- [x] T010 [US1] Implement 500ms hover timer in `src/pages/DailyPlanPage.tsx` within `onDragOver` to trigger `onDateChange`
- [x] T011 [US1] Update `handleDragEnd` in `src/pages/DailyPlanPage.tsx` to call `moveItemToDate` when dropped on edge panels

**Checkpoint**: User Story 1 functional - Date shifting via side panels is discoverable and active.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and performance audit

- [x] T012 Perform manual verification of all scenarios in `specs/028-move-subtask-filter-daily/quickstart.md`
- [x] T013 [P] Verify 100ms filter toggle latency (SC-002) using Chrome DevTools performance tab
- [x] T014 [P] Strict type audit: Eliminate all remaining `any` in `DailyPlanView.tsx` and `SideGuidePanels.tsx`
- [x] T015 Final build check: `npm run build`

---

## Dependencies & Execution Order

1. **Phase 2** is a prerequisite for US1 and US2 implementation.
2. **US2 (Phase 3)** is established first to ensure sorting stability before introducing cross-date complexity.
3. **US1 (Phase 4)** is the primary UX enhancement.
4. **Phase 5** is the final wrap-up.

## Parallel Execution Examples

- **Foundational**: T002 and T003 can be developed independently.
- **UI & Logic**: T004 (Toolbar UI) and T002 (Repo Logic) can proceed simultaneously.

## Implementation Strategy

### MVP First (Filter & Basic Gesture)
1. Complete Phase 2.
2. Implement Filter (US2).
3. Implement Side Panels (US1).
4. **STOP and VALIDATE**: Test reordering and date jumping on a mobile emulator.

### Incremental Delivery
1. Start with the filter as it provides immediate value for cluttered lists.
2. Deliver the gesture navigation to complete the modern UX feel.
3. Apply final type safety and performance polish.
