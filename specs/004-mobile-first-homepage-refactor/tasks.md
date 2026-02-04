---
description: "Task list for Mobile-First Homepage Refactor"
---

# Tasks: Mobile-First Homepage Refactor

**Input**: Design documents from `/specs/004-mobile-first-homepage-refactor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Architecture**: React (Vite), React Router, TailwindCSS 4, Shadcn UI.
**Frontend**: Mobile-first responsive UI with drill-down navigation.
**Testing**: Vitest, React Testing Library.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and routing setup.

- [x] T001 Configure new route `/category/:categoryId` in `src/App.tsx`
- [x] T002 Create `CategoryDetailPage` component skeleton in `src/pages/CategoryDetailPage.tsx`
- [x] T003 [P] Add Lucide icons needed for FAB and navigation in `src/lib/utils.ts` (if applicable) or verify installation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and data fetching logic.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Create `useCategorySummary` hook to fetch aggregated category data in `src/hooks/useCategorySummary.ts`
- [x] T005 [P] Implement `QuickCreateTaskDrawer` base component using Shadcn Drawer in `src/features/tasks/QuickCreateTaskDrawer.tsx`

**Checkpoint**: Routing and data hooks ready for UI implementation.

---

## Phase 3: User Story 1 - Category Overview & Quick Actions (Priority: P1) 🎯 MVP

**Goal**: Transform the homepage into a clean category overview with a functional FAB.

**Independent Test**: Verify `HomePage` displays category cards and clicking the FAB opens an empty drawer.

### Implementation for User Story 1

- [x] T006 Create `CategoryOverview` component to list categories in `src/features/categories/CategoryOverview.tsx`
- [x] T006.1 [US1] Implement Empty State UI for users with no categories in `src/features/categories/CategoryOverview.tsx`
- [x] T007 [P] Create `CategoryCard` component for summary display in `src/features/categories/CategoryCard.tsx`
- [x] T008 Refactor `HomePage.tsx` to remove old task lists and integrate `CategoryOverview`
- [x] T009 Add Floating Action Button (FAB) to `HomePage.tsx` to trigger `QuickCreateTaskDrawer`

**Checkpoint**: Homepage refactored to focus on categories with an accessible creation entry point.

---

## Phase 4: User Story 2 - Category Drill-down (Priority: P2)

**Goal**: Enable detailed task management within a dedicated category view.

**Independent Test**: Tapping a category card navigates to the detail page showing that category's tasks.

### Implementation for User Story 2

- [x] T010 Create `CategoryTaskDetail` component optimized for mobile width in `src/features/tasks/CategoryTaskDetail.tsx`
- [x] T010.1 [US2] Implement inline editing logic (title update, status toggle) in `src/features/tasks/CategoryTaskDetail.tsx`
- [x] T011 Update `CategoryDetailPage.tsx` to render `CategoryTaskDetail` using the `categoryId` parameter
- [x] T012 Add a header with a "Back" button to `CategoryDetailPage.tsx` for returning to `HomePage`
- [x] T013 Update `CategoryCard.tsx` to navigate to the detail page on click

**Checkpoint**: Drill-down navigation fully functional with readable task lists.

---

## Phase 5: User Story 3 - Simplified Task Creation (Priority: P3)

**Goal**: Optimize the task creation flow for speed and feedback.

**Independent Test**: Creating a task via the FAB shows a toast and updates the relevant category count/list.

### Implementation for User Story 3

- [x] T014 Implement simplified form logic (Title + Category Select) in `QuickCreateTaskDrawer.tsx`
- [x] T015 Integrate toast notifications from `sonner` in `QuickCreateTaskDrawer.tsx` upon submission
- [x] T016 Ensure `QuickCreateTaskDrawer` closes automatically after successful creation

**Checkpoint**: Task creation is fast, intuitive, and provides clear confirmation.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: UX refinements and final validation.

- [x] T017 Audit mobile "thumb zone" accessibility for FAB and primary action buttons
- [x] T018 Optimize transition performance between `HomePage` and `CategoryDetailPage`
- [x] T019 Clean up unused code and components from the old homepage implementation
- [x] T020 [P] Add unit tests for `useCategorySummary` hook logic in `src/hooks/__tests__/useCategorySummary.test.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - US1 (Phase 3) is the primary MVP.
  - US2 (Phase 4) depends on US1 structure.
  - US3 (Phase 5) enhances US1 and US2.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### Parallel Opportunities

- T003, T005, T007, T020 can be worked on in parallel as they touch different files.
- US1 and US2 implementation can technically overlap once the data hook (T004) is ready.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational logic.
2. Refactor `HomePage` to show categories and the FAB.
3. **VALIDATE**: Ensure categories are visible and the Drawer triggers correctly.

### Incremental Delivery

1. Add Drill-down navigation (US2) to make the app usable again.
2. Finalize the Quick Creation flow (US3) with feedback.
3. Each phase delivers a complete, testable part of the mobile-first experience.
