---
description: "Task list for Home Page Refactor & Terminology Update"
---

# Tasks: Home Page Refactor & Terminology Update

**Input**: Design documents from `/specs/015-home-page-refactor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual verification of routing and terminology is the primary validation strategy.

**Organization**: Tasks are grouped by phase, with implementation focused on routing swap, global rename, and empty state guidance.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project state and prepare for routing changes.

- [x] T001 Verify project structure and current route definitions in `src/App.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the new routing architecture.

- [x] T002 Define route for `/management` to host the original Category Overview in `src/App.tsx`

**Checkpoint**: New route structure is defined; ready for migration.

---

## Phase 3: User Story 1 - Home Page to Daily Plan (Priority: P1) 🎯 MVP

**Goal**: Make the Daily Plan the application's landing page.

**Independent Test**: Visit `/` and verify `DailyPlanPage` is rendered.

### Implementation for User Story 1

- [x] T003 Update root path `/` to render `DailyPlanPage` instead of `HomePage` in `src/App.tsx`
- [x] T004 Update `/management` path to render `HomePage` in `src/App.tsx`
- [x] T004b Implement redirect from `/daily-plan` to `/` in `src/App.tsx`
- [x] T005 Update navigation links in `src/components/layout/AppLayout.tsx` to match new route mapping

**Checkpoint**: Entry point has been successfully swapped.

---

## Phase 4: User Story 2 - Terminology Update (Priority: P1)

**Goal**: Replace all "主題分類" text with "任務管理" globally.

**Independent Test**: Search for "主題分類" in the UI and verify it is replaced by "任務管理".

### Implementation for User Story 2

- [x] T006 Rename "主題分類" to "任務管理" in navigation items in `src/components/layout/AppLayout.tsx`
- [x] T007 Update header text and labels in `src/pages/HomePage.tsx`
- [x] T008 Update display titles in `src/features/categories/CategoryOverview.tsx`

**Checkpoint**: Global terminology has been standardized.

---

## Phase 5: User Story 3 - Backlog Empty State Guidance (Priority: P2)

**Goal**: Guide users to create tasks when the backlog is empty.

**Independent Test**: Clear tasks, open Backlog Drawer, click "前往任務管理", verify navigation and drawer closure.

### Implementation for User Story 3

- [x] T009 Add `onClose` optional prop to `BacklogContentProps` interface in `src/features/daily-plan/BacklogContent.tsx`
- [x] T010 Pass `() => setIsDrawerOpen(false)` to `BacklogContent` via `onClose` prop in `src/pages/DailyPlanPage.tsx`
- [x] T011 Implement navigation button "前往任務管理" in empty state branch of `src/features/daily-plan/BacklogContent.tsx` using `useNavigate` and `onClose`
- [x] T011b Unit test for empty state button visibility and navigation callback in `src/features/daily-plan/__tests__/BacklogContent.test.tsx`
- [x] T012 Remove any obsolete comments or unused code related to the old home page layout in `src/pages/HomePage.tsx`
- [x] T013 Verify that navigation "Active" states correctly highlight the current route in `src/components/layout/AppLayout.tsx`
- [x] T014 Run manual verification steps from `specs/015-home-page-refactor/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** and **Foundational (Phase 2)** must be completed first.
- **Phase 3 (US1)** and **Phase 4 (US2)** can proceed in parallel once the foundation is set.
- **Phase 5 (US3)** depends on the navigation logic from Phase 3.

### Implementation Strategy

1.  **Routing First**: Ensure the app opens to the Daily Plan.
2.  **Rename Second**: Clean up the language.
3.  **Onboarding Third**: Add the guidance button for new users.
