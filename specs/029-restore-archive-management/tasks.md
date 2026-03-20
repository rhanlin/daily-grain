# Tasks: Restore Archive Management

**Input**: Design documents from `/specs/029-restore-archive-management/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-actions.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database schema upgrade and initial routing

- [x] T001 [P] Upgrade IndexedDB to Version 6 in `src/lib/db.ts`: Add `isArchived` index to `subtasks` table
- [x] T002 Implement Version 6 migration logic in `src/lib/db.ts` to initialize `isArchived: false` for all subtasks
- [x] T003 [P] Add route for `/archive` in `src/App.tsx` pointing to the new Archive feature

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core repository logic and visibility hooks

- [x] T004 [P] Update `repository.subtasks.update` in `src/lib/repository.ts` to support the `isArchived` field
- [x] T005 [P] Update `repository.subtasks.delete` in `src/lib/repository.ts` to handle permanent deletion
- [x] T006 Update `useBacklog` hook in `src/hooks/useBacklog.ts` to strictly exclude `isArchived: true` subtasks
- [x] T007 Update `useDailyPlan` hook in `src/hooks/useDailyPlan.ts` to filter out archived items from the plan view
- [x] T008 [P] Create `src/hooks/useArchive.ts` to fetch and manage archived categories, tasks, and subtasks

**Checkpoint**: Foundational logic ready - Data layer supports subtask archival and system-wide visibility rules are enforced.

---

## Phase 3: User Story 1 - 恢復任務與子任務的封存入口 (Priority: P1) 🎯 MVP

**Goal**: Restore archive entry points in the Task and SubTask UI.

**Independent Test**: Archive a subtask; verify it disappears from the list and its `isArchived` state is persisted in DB.

### Implementation for User Story 1

- [x] T009 [P] [US1] Add "封存子任務" option to the `Drawer` and desktop hover actions in `src/features/tasks/SubTaskList.tsx`
- [x] T010 [P] [US1] Ensure `src/features/tasks/TaskItem.tsx` correctly renders the "封存任務" button for all view modes
- [x] T011 [US1] Create unit tests in `src/lib/__tests__/repository.test.ts` to verify SubTask archival state changes

**Checkpoint**: User Story 1 functional - Users can now archive individual subtasks and tasks from their active lists.

---

## Phase 4: User Story 2 - 封存管理介面與還原功能 (Priority: P2)

**Goal**: Implement the Archive Center UI for restoration and management.

**Independent Test**: Restore an archived subtask; verify it reappears in its parent task list.

### Implementation for User Story 2

- [x] T012 [P] [US2] Implement `src/pages/ArchivePage.tsx` with Tabbed navigation (Categories, Tasks, SubTasks)
- [x] T013 [P] [US2] Create list items for archived items with "Restore" and "Permanent Delete" buttons
- [x] T014 [US2] Implement restoration logic in `ArchiveCenterPage.tsx`: Include parent archival check and user prompts
- [x] T015 [P] [US2] Add "已封存項目" link to the Category overview grid in `src/features/categories/CategoryOverview.tsx`

**Checkpoint**: User Story 2 functional - Complete archive lifecycle management is available via a dedicated UI.

---

## Phase 5: User Story 3 - 分類層級的封存管理 (Priority: P3)

**Goal**: Handle bulk archival at the category level.

**Independent Test**: Archive a category; verify all its tasks are also marked as archived.

### Implementation for User Story 3

- [x] T016 [US3] Update `repository.categories.delete` in `src/lib/repository.ts` to cascade `status: 'ARCHIVED'` and `isArchived: true` to all child items
- [x] T017 [US3] Update `CategoryActionDrawer.tsx` and `CategoryOverview.tsx` to use "Archive" terminology and icons

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and quality audit

- [x] T018 Perform manual verification scenarios from `specs/029-restore-archive-management/quickstart.md`
- [x] T019 [P] Strict type audit: Eliminate `any` in `ArchivePage.tsx` and `useArchive.ts` per Constitution Principle I
- [x] T020 Final build check: `npm run build`

---

## Dependencies & Execution Order

1. **Phase 1 & 2** are prerequisites for all UI work to ensure DB schema and visibility hooks are stable.
2. **User Story 1 (Phase 3)** is the MVP and must be completed to generate test data for management views.
3. **User Story 2 (Phase 4)** and **User Story 3 (Phase 5)** can be worked on in parallel once US1 is stable.
4. **Phase 6** is the final wrap-up.

## Parallel Execution Examples

- **Data & UI**: T004 (Logic) and T009 (UI) can be developed simultaneously.
- **Management UI**: T012 and T013 can be developed in parallel.

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete schema migration (Phase 1).
2. Implement repository archival support (Phase 2).
3. Add entry points to Task/SubTask UI (Phase 3).
4. **STOP and VALIDATE**: Verify items can be archived and disappear from active views.

### Incremental Delivery
1. Add the Archive Center (US2) to allow users to view and restore items.
2. Polish category-level cascading (US3).
3. Final verification and type audit.
