---
description: "Task list for Add Task FAB on Mobile"
---

# Tasks: Add Task FAB on Mobile

**Input**: Design documents from `/specs/010-add-task-fab/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual verification on device is the primary testing strategy. No automated UI tests requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify dependencies and component availability.

- [x] T001 Verify `QuickCreateTaskDrawer` is available in `src/features/tasks/QuickCreateTaskDrawer.tsx`
- [x] T002 Verify `useMedia` hook is available from `react-use` (check `package.json` or imports)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic preparations.

- [x] T003 [P] Review `src/pages/CategoryDetailPage.tsx` to identify insertion point for FAB

**Checkpoint**: Ready to implement UI changes.

---

## Phase 3: User Story 1 - 手機版任務列表快速新增 (Mobile Task Creation via FAB) (Priority: P1) 🎯 MVP

**Goal**: Implement the FAB on the Category Detail Page to allow quick task creation on mobile.

**Independent Test**: On mobile view, go to Category Detail, click FAB, create task. Task should appear in list.

### Implementation for User Story 1

- [x] T004 [US1] Import `QuickCreateTaskDrawer` and `useMedia` in `src/pages/CategoryDetailPage.tsx`
- [x] T005 [US1] Add state `isCreateTaskOpen` to `src/pages/CategoryDetailPage.tsx` to control drawer visibility
- [x] T006 [US1] Implement `isMobile` check using `useMedia('(max-width: 768px)')` in `src/pages/CategoryDetailPage.tsx`
- [x] T007 [US1] Render `QuickCreateTaskDrawer` in `src/pages/CategoryDetailPage.tsx` passing `categoryId` as `defaultCategoryId`
- [x] T008 [US1] Render FAB `Button` in `src/pages/CategoryDetailPage.tsx` with fixed positioning (`bottom-24 right-6`) and conditional rendering based on `isMobile`
- [x] T009 [US1] Connect FAB `onClick` handler to set `isCreateTaskOpen(true)` in `src/pages/CategoryDetailPage.tsx`

**Checkpoint**: FAB works on mobile and creates tasks in the correct category.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final review and adjustments.

- [x] T010 Run manual verification steps from `specs/010-add-task-fab/quickstart.md`
- [x] T011 Verify FAB styling matches Home Page FAB (size, shadow, icon)
- [x] T012 Verify FAB does not overlap with other critical UI elements on mobile

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 & 2**: Prerequisites.
- **Phase 3**: Core implementation.
- **Phase 4**: Verification.

### User Story Dependencies

- **User Story 1 (P1)**: Independent.

### Parallel Opportunities

- T004-T009 are sequential within the same file (`CategoryDetailPage.tsx`), so limited parallelism unless broken down finely, but one developer can handle it efficiently.

---

## Implementation Strategy

### MVP First (User Story 1)

1.  **Setup**: Check components.
2.  **Implementation**: Add FAB and Drawer to `CategoryDetailPage.tsx`.
3.  **Validate**: Test on mobile view.
