---
description: "Task list for Task UI Refinement"
---

# Tasks: Task UI Refinement

**Input**: Design documents from `/specs/017-task-ui-refinement/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual verification via mobile emulation and DB migration checks. Automated tests for DB migration and sorting logic.

**Organization**: Tasks are grouped by phase, with implementation focused on DB migration, Eisenhower filtering, and Task Management UI/DnD.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database schema update for persistent sorting.

- [X] T001 Update IndexedDB schema to v3 in `src/lib/db.ts` to add `orderIndex` to `categories` table
- [X] T002 [P] Implement migration logic in `src/lib/db.ts` to initialize `orderIndex` for existing categories (based on their current `createdAt` order)
- [X] T002b [P] Create unit tests for DB v3 migration in `src/lib/__tests__/db.test.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core repository methods for ordering.

- [X] T003 Implement `repository.categories.updateOrder` method in `src/lib/repository.ts` to handle bulk `orderIndex` updates
- [X] T003b [P] Create unit tests for `repository.categories.updateOrder` in `src/lib/__tests__/repository.test.ts`

**Checkpoint**: Database and repository are ready for persistent reordering.

---

## Phase 3: User Story 1 - Eisenhower View Default Level (Priority: P1) 🎯 MVP

**Goal**: Default the Matrix view to Task-level items.

**Independent Test**: Navigate to /matrix and verify only Tasks are shown initially.

### Implementation for User Story 1

- [X] T004 [US1] Update default `viewFilter` state from `'ALL'` to `'TASK'` in `src/features/tasks/EisenhowerMatrix.tsx`

**Checkpoint**: Eisenhower view now follows user-requested defaults.

---

## Phase 4: User Story 2 - Task Management UI Update (Priority: P1)

**Goal**: Update Category display to square cards and 2-column mobile grid.

**Independent Test**: View /management on mobile and verify 2-column layout with square cards.

### Implementation for User Story 2

- [X] T005 [P] [US2] Refactor `CategoryOverview.tsx` to use `grid-cols-2` for small screens and `aspect-square` for card containers
- [X] T006 [P] [US2] Adjust internal styling of `CategoryCard.tsx` to ensure title and metadata fit square aspect ratio (implement responsive font sizes or line-clamping). Apply `touch-action: none` to cards to prevent mobile scroll interference.

---

## Phase 5: User Story 3 - Reorder Categories via DnD (Priority: P2)

**Goal**: Enable persistent drag-and-drop reordering for category cards with mobile optimization.

**Independent Test**: Reorder cards on /management, refresh page, and verify order persists.

### Implementation for User Story 3

- [X] T007 [US3] Integrate `DndContext` and `SortableContext` in `src/features/categories/CategoryOverview.tsx`. Configure `TouchSensor` with 150ms delay and 5px tolerance.
- [X] T008 [US3] Implement `handleDragEnd` logic using `arrayMove` and repository update in `src/features/categories/CategoryOverview.tsx`. Include check to skip update if categories count <= 1.
- [X] T009 [US3] Implement `useSortable` hook in `src/features/categories/CategoryCard.tsx` and ensure drag listeners are correctly attached.

**Checkpoint**: Categories can now be reordered flexibly and persist.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements and verification.

- [X] T010 [P] CSS Audit: Ensure square cards maintain layout on mid-size tablets and desktops
- [X] T011 [P] Haptic Feedback: Add `navigator.vibrate(50)` to category drag start events in `src/features/categories/CategoryOverview.tsx`
- [X] T012 Run manual verification steps from `specs/017-task-ui-refinement/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** must be completed before **Phase 2** (Repository).
- **Foundational (Phase 2)** must be completed before **Phase 5** (DnD Implementation).
- **Phase 3 (US1)** and **Phase 4 (US2)** can proceed in parallel after Setup.

### Implementation Strategy

1.  **DB First**: Get the schema versioned and ready.
2.  **Layout second**: Update the CSS to the new design.
3.  **Interactive third**: Hook up the dnd-kit logic.
4.  **Verification**: Confirm persistence and default filters.
