---
description: "Task list for Eisenhower Matrix UI Refactor"
---

# Tasks: Eisenhower Matrix UI Refactor

**Input**: Design documents from `/specs/007-matrix-ui-refactor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md.

**Architecture**: React (Vite), TailwindCSS 4, Radix UI (Scroll Area).
**Frontend**: High-density 2x2 CSS Grid with axis labels.
**Testing**: Vitest, React Testing Library.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Component isolation and prerequisite verification.

- [x] T001 Verify existence of `src/components/ui/scroll-area.tsx`
- [x] T002 Create skeleton for `MatrixQuadrant` in `src/features/tasks/MatrixQuadrant.tsx`
- [x] T003 [P] Add hex color constants for quadrants in `src/features/tasks/MatrixQuadrant.tsx`

---

## Phase 2: Foundational (Quadrant Logic)

**Purpose**: Core logic for rendering a single colored block with independent scrolling.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Implement `MatrixQuadrant` component with `ScrollArea` integration in `src/features/tasks/MatrixQuadrant.tsx`
- [x] T005 Refactor `useLiveQuery` in `src/features/tasks/EisenhowerMatrix.tsx` to join `Category` data and provide `categoryColor` for each item

**Checkpoint**: `MatrixQuadrant` is ready to render items with scroll support.

---

## Phase 3: User Story 1 - Flat Quadrant Visualization (Priority: P1) 🎯 MVP

**Goal**: Implement the 2x2 flat grid with axis labels.

**Independent Test**: Verify matrix displays as a 2x2 grid with colors #cee9f2, #d0ebca, #fddfbd, #fca2a1 and visible X/Y axis labels.

### Implementation for User Story 1

- [x] T006 Implement 2x2 CSS Grid container in `src/features/tasks/EisenhowerMatrix.tsx`
- [x] T007 Add Y-Axis label (重要度) with `writing-mode: vertical-lr` in `src/features/tasks/EisenhowerMatrix.tsx`
- [x] T008 Add X-Axis label (緊急度) below the grid in `src/features/tasks/EisenhowerMatrix.tsx`
- [x] T009 [P] Map background colors to each quadrant per `data-model.md` in `src/features/tasks/MatrixQuadrant.tsx`

**Checkpoint**: The matrix looks like a standard flat quadrant diagram.

---

## Phase 4: User Story 2 - Tasks with Category Indicators (Priority: P1)

**Goal**: Show category visual context for each task.

**Independent Test**: Add a task to a colored category and verify its indicator appears next to the task in the matrix.

### Implementation for User Story 2

- [x] T010 Implement colored indicator (dot or vertical bar) using `categoryColor` in `src/features/tasks/MatrixQuadrant.tsx`
- [x] T011 [P] Ensure task titles handle long text via truncation within the quadrant items

**Checkpoint**: Tasks in the matrix provide immediate category context.

---

## Phase 5: User Story 3 - Mobile Height Optimization (Priority: P2)

**Goal**: Prevent vertical layout collapse on mobile.

**Independent Test**: Populate one quadrant with many items and verify the grid height remains fixed while the quadrant scrolls internally.

### Implementation for User Story 3

- [x] T012 Set fixed height for the Matrix container to `calc(100dvh - 130px)` in `src/features/tasks/EisenhowerMatrix.tsx` to eliminate external scrolling on mobile
- [x] T013 Ensure each `MatrixQuadrant` child grows to fill its grid cell (`h-full`) to enable `ScrollArea`

**Checkpoint**: Matrix remains perfectly proportioned on mobile screens.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup and visual refinements.

- [x] T014 Remove legacy "I. 重要且緊急" style headers from `Quadrant` logic
- [x] T015 Verify visual consistency of labels and colors across mobile and desktop viewports

---

## Phase 7: Space Maximization (Visual Cleanup)



**Purpose**: Maximize quadrant screen real estate by removing UI clutter.



- [x] T016 Remove page title and description text in `src/pages/MatrixPage.tsx`

- [x] T017 Replace Tabs with a Floating Action Button (FAB) filter menu in `src/features/tasks/EisenhowerMatrix.tsx`

- [x] T018 Reposition "Long press to lock" hint as a micro-watermark near axis labels in `src/features/tasks/EisenhowerMatrix.tsx`

- [x] T019 Remove padding from Y-axis markers to achieve compact edge-to-edge alignment in `src/features/tasks/EisenhowerMatrix.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phase 3 & 4)**: Depend on Foundational completion. US1 and US2 can run in parallel if foundational components exist.
- **User Story 3 (Phase 5)**: Depends on US1 being complete (Grid structure).
- **Polish (Phase 6)**: Depends on all user stories being complete.

### Parallel Opportunities

- T003, T009, T011 can be worked on in parallel.
- T002 and T005 can start simultaneously once Phase 1 logic is understood.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Implement the flat quadrant grid first to provide the visual anchor.
2. Ensure tasks are visible with category colors immediately.
3. **VALIDATE**: Ensure the 2x2 colors match the hex codes exactly.

### Incremental Delivery

1. Once colors are correct, add axis labels.
2. Finally, lock the height and enable internal scrolling to solve the mobile experience.
