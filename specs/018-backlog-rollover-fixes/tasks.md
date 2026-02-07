---
description: "Task list for Backlog and Rollover Fixes"
---

# Tasks: Backlog and Rollover Fixes

**Input**: Design documents from `/specs/018-backlog-rollover-fixes/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit tests for batch rollover are required to satisfy Constitution Principle I.

**Organization**: Tasks are grouped by phase, with implementation focused on resolving UI occlusion, gesture conflicts, and rollover reliability.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the testing environment for rollover logic.

- [x] T001 [P] Create unit test file `src/lib/__tests__/rollover.test.ts` to simulate multi-item rollover scenarios

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic fix for the rollover process.

- [x] T002 Refactor `triggerRollover` in `src/lib/rollover.ts` to use `db.transaction` for atomic batch processing of all uncompleted items

**Checkpoint**: Core logic is stable; ready for UI and interaction refinement.

---

## Phase 3: User Story 1 - 修正備忘清單多選介面遮擋 (Priority: P1) 🎯 MVP

**Goal**: Ensure Backlog items are not covered by the action bar in multi-select mode.

**Independent Test**: Scroll to the bottom of the Backlog in multi-select mode and verify the last item is fully visible above the footer.

### Implementation for User Story 1

- [x] T003 [US1] Add conditional `pb-24` (bottom padding) to the main container in `src/features/daily-plan/CategorySlide.tsx` when `isSelectionMode` is true
- [x] T004 [P] [US1] Adjust the floating action bar z-index and backdrop blur in `src/features/daily-plan/BacklogContent.tsx` to match app design standards

**Checkpoint**: Backlog items are no longer occluded by UI elements.

---

## Phase 4: User Story 2 - 修正備忘清單多選捲動衝突 (Priority: P1)

**Goal**: Prevent accidental item selection during list scrolling.

**Independent Test**: Swipe to scroll the Backlog list in multi-select mode and verify no selection state changes occur on swiped items.

### Implementation for User Story 2

- [x] T005 [US2] Update `DraggableItem` (internal to `CategorySlide.tsx`) to track pointer start position and compare with end position to detect significant movement
- [x] T006 [US2] Modify `onItemTap` handling in `src/features/daily-plan/CategorySlide.tsx` to ignore clicks if the pointer movement distance exceeds 10px
- [x] T006b [P] [US2] Create unit tests for gesture isolation (tap vs. scroll) in `src/features/daily-plan/__tests__/BacklogGesture.test.tsx`

**Checkpoint**: Selection and scrolling gestures are clearly separated.

---

## Phase 5: User Story 3 - 修正多項目自動延宕邏輯 (Priority: P1)

**Goal**: Ensure 100% of uncompleted items roll over to the next day.

**Independent Test**: Mark multiple items as uncompleted yesterday, refresh app, and verify all appear in today's plan with the "Rollover" label.

### Implementation for User Story 3

- [x] T007 [US3] Implement the loop in `src/lib/rollover.ts` using `await` or `Promise.all` within the transaction to ensure every item is processed sequentially or concurrently without skipping
- [x] T008 [US3] Verify `isRollover` property is correctly persisted for every item migrated in `src/lib/rollover.ts`
- [x] T009 [US3] Run `T001` unit tests and verify 100% success rate for batch rollover logic

**Checkpoint**: Data integrity for rollover is fully restored.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final review and regression testing.

- [x] T010 [P] Final verification of all manual steps in `specs/018-backlog-rollover-fixes/quickstart.md`
- [x] T011 [P] Ensure no regression in single-item drag-and-drop or date navigation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 2** must be completed before **Phase 5** (logic verification).
- **Phase 3** and **Phase 4** can proceed in parallel.

### Implementation Strategy

1.  **Fix the Data**: Get rollover working first so user data is safe.
2.  **Fix the UI**: Address the occlusion and interaction bugs.
3.  **Validate**: Run the batch tests and manual mobile checks.
