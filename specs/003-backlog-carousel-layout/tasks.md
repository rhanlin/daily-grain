---
description: "Task list for Backlog Carousel & Scrolling Layout"
---

# Tasks: Backlog Carousel & Scrolling Layout

**Input**: Design documents from `/specs/003-backlog-carousel-layout/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md.

**Architecture**: React (Vite), Shadcn UI, embla-carousel-react.
**Frontend**: React 18+, TailwindCSS 4.
**Testing**: Vitest, React Testing Library.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and component installation.

- [x] T001 [P] Install Shadcn Carousel component (`npx shadcn@latest add carousel`)
- [x] T002 [P] Verify `react-use` and `embla-carousel-react` dependencies in `package.json`

---

## Phase 2: Foundational (Logic & Shared Components)

**Purpose**: Core logic for grouping data and reusable UI building blocks.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Implement `useBacklog` hook to group unscheduled tasks by category in `src/hooks/useBacklog.ts`
- [x] T004 [P] Create `CategorySlide` component to render a single category's task list in `src/features/daily-plan/CategorySlide.tsx`
- [x] T005 [P] Create `BacklogContent` component skeleton to host the responsive layouts in `src/features/daily-plan/BacklogContent.tsx`

**Checkpoint**: Foundational logic and components ready for integration.

---

## Phase 3: User Story 1 - Mobile Backlog Carousel (Priority: P1) 🎯 MVP

**Goal**: Implement the horizontal carousel for mobile view in the Drawer.

**Independent Test**: Resize browser to mobile width (<768px), open backlog drawer, and swipe between category slides.

### Implementation for User Story 1

- [x] T006 [US1] Implement horizontal Carousel layout in `src/features/daily-plan/BacklogContent.tsx` for mobile view
- [x] T007 [US1] Integrate `embla-carousel-react` gesture handlers in `src/features/daily-plan/BacklogContent.tsx`
- [x] T008 [US1] Add current category name indicator to the mobile carousel header in `src/features/daily-plan/BacklogContent.tsx`

**Checkpoint**: Mobile Carousel is fully functional and navigable via gestures.

---

## Phase 4: User Story 2 - Desktop Backlog Vertical List (Priority: P2)

**Goal**: Implement the vertical scrollable list for desktop view in the Side Panel.

**Independent Test**: Resize browser to desktop width (>768px) and verify all categories are stacked vertically with a working scrollbar.

### Implementation for User Story 2

- [x] T009 [US2] Implement vertical stacked layout using `ScrollArea` in `src/features/daily-plan/BacklogContent.tsx` for desktop view
- [x] T010 [US2] Integrate the refactored `BacklogContent` into `src/pages/DailyPlanPage.tsx`, replacing the old inline backlog logic
- [x] T011 [US2] Ensure `onItemTap` (mobile) and `onDragEnd` (desktop) callbacks are correctly passed to `CategorySlide.tsx`

**Checkpoint**: Desktop view displays all categories vertically with correct interaction handlers.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: UX refinements and final validation.

- [x] T012 [Polish] Implement active index persistence to maintain category focus when resizing window in `src/features/daily-plan/BacklogContent.tsx`
- [x] T013 [Polish] Add "Empty State" handling for categories with no tasks in `src/features/daily-plan/BacklogContent.tsx`
- [x] T014 [Polish] Verify 60fps scrolling and swiping performance on mobile emulator
- [x] T015 [P] Add unit tests for `useBacklog` grouping logic in `src/hooks/__tests__/useBacklog.test.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phase 3 & 4)**: Depend on Foundational phase completion. Can proceed in parallel if US1 logic is prioritized.
- **Polish (Phase 5)**: Depends on both US1 and US2 being complete.

### Parallel Opportunities

- T001 and T002 can run together.
- T004 and T005 can run together within Phase 2.
- US1 and US2 implementation (T006-T011) can technically run in parallel once `BacklogContent` skeleton exists.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases.
2. Implement Mobile Carousel (US1) as it represents the most significant UX change.
3. Validate on mobile emulator before proceeding to desktop layout.

### Incremental Delivery

1. Refactor logic into `useBacklog` hook first.
2. Swap the `DailyPlanPage` backlog with the new `BacklogContent` component early to verify integrations.
3. Add `Carousel` and `ScrollArea` as layers within the new component.