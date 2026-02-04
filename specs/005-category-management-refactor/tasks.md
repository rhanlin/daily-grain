---
description: "Task list for Category Management Refactor"
---

# Tasks: Category Management Refactor

**Input**: Design documents from `/specs/005-category-management-refactor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Architecture**: React (Vite), Dexie.js (IndexedDB), TailwindCSS 4, Shadcn UI.
**Frontend**: Mobile-first UI with gesture-based interactions.
**Testing**: Vitest, React Testing Library.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Update backend/repository layer to support new operations.

- [x] T001 Implement `update` and `delete` methods for categories in `src/lib/repository.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core UI components and hook modifications.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 [P] Implement `CreateCategoryDrawer` component UI in `src/features/categories/CreateCategoryDrawer.tsx`
- [x] T003 [P] Update `QuickCreateTaskDrawer` to accept an optional `defaultCategoryId` prop in `src/features/tasks/QuickCreateTaskDrawer.tsx`
- [x] T004 Create `CategoryActionDrawer` component skeleton in `src/features/categories/CategoryActionDrawer.tsx`

**Checkpoint**: Repository methods and base Drawers ready for integration.

---

## Phase 3: User Story 1 - Create Category via FAB (Priority: P1) 🎯 MVP

**Goal**: Repurpose the FAB to create categories.

**Independent Test**: Tapping the FAB on the homepage opens the New Category drawer; submitting creates a category.

### Implementation for User Story 1

- [x] T005 [US1] Update `HomePage.tsx` to trigger `CreateCategoryDrawer` from the Floating Action Button
- [x] T006 [US1] Implement form submission and validation logic in `CreateCategoryDrawer.tsx`

**Checkpoint**: Users can now organize their workspace by adding new categories directly from the home view.

---

## Phase 4: User Story 2 - Category Long-press Management (Priority: P1)

**Goal**: Enable secondary actions on categories via long-press.

**Independent Test**: Long-pressing a category card opens the Action Drawer; editing name or adding a task works as expected.

### Implementation for User Story 2

- [x] T007 [US2] Integrate `useLongPress` hook in `src/features/categories/CategoryCard.tsx` to detect gestures
- [x] T008 [US2] Update `src/features/categories/CategoryOverview.tsx` to manage Action Drawer state and selected category
- [x] T009 [US2] 在 `src/features/categories/CategoryActionDrawer.tsx` 中實作編輯觸發邏輯，並建立 `EditCategoryDialog.tsx` 處理更新。
- [x] T010 [US2] Implement "Add Task" action in `src/features/categories/CategoryActionDrawer.tsx` that triggers `QuickCreateTaskDrawer` with the pre-selected category

**Checkpoint**: Category cards support context-aware management without leaving the homepage.

---

## Phase 5: User Story 3 - Navigate to Category Detail (Priority: P2)

**Goal**: Preserve core navigation path.

**Independent Test**: Single tapping a category card still navigates to the detail page.

### Implementation for User Story 3

- [x] T011 [US3] Verify and fix event propagation in `src/features/categories/CategoryCard.tsx` to ensure single-click navigation works when not long-pressed

**Checkpoint**: Primary navigation remains robust alongside new gesture-based features.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: UX refinements and verification.

- [x] T012 Audit long-press timing (500ms) and add subtle visual feedback (scale/opacity) during press
- [x] T013 Clean up old `QuickCreateTaskDrawer` references in `HomePage.tsx`
- [x] T014 [P] Add unit tests for category update logic in `src/lib/__tests__/repository.test.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion.
- **User Stories (Phase 3 & 4)**: Depend on Foundational phase.
  - US1 and US2 can be worked on in parallel once foundational drawers exist.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### Parallel Opportunities

- T002 and T003 can be implemented in parallel.
- T014 can be started as soon as T001 is done.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Implement repository updates.
2. Repurpose FAB for Category creation.
3. Enable long-press Action Drawer.
4. **VALIDATE**: Ensure basic CRUD for categories is functional.

### Incremental Delivery

1. Integrate context-aware task creation from the Action Drawer.
2. Refine the gesture conflict resolution.
3. Add tests and polish animations.