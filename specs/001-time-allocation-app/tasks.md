---
description: "Task list for Personal Time Allocation App (Local-First PWA)"
---

# Tasks: 001-time-allocation-app

**Input**: Design documents from `/specs/001-time-allocation-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md.

**Architecture**: Local-First PWA (Dexie.js + Firebase Sync).
**Frontend**: React, Vite, TailwindCSS 4, Shadcn UI.
**Testing**: Vitest (Unit/Integration).

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure.

- [x] T001 Create Vite project with React and TypeScript (`npm create vite@latest . -- --template react-ts`)
- [x] T002 Initialize TailwindCSS v4 configuration in `src/index.css`
- [x] T003 Initialize Shadcn UI (`npx shadcn@latest init`) and add basic components (Button, Card, Dialog, Input, Checkbox)
- [x] T004 [P] Install and configure Vitest and React Testing Library in `vitest.config.ts`
- [x] T005 [P] Install Dexie.js and React hooks (`dexie-react-hooks`)
- [x] T006 [P] Install Firebase SDK and create `src/lib/firebase.ts` with env var configuration
- [x] T007 [P] Install dnd-kit (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`)
- [x] T008 [P] Configure PWA manifest (icons, metadata) in `public/manifest.json` and basic Service Worker

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure (Database, Auth, Sync) that MUST be complete before UI work.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T009 Define Dexie database schema in `src/lib/db.ts` (Categories, Tasks, SubTasks, DailyPlanItems)
- [ ] T010 Implement Authentication Context (`AuthProvider`) using Firebase Google Sign-In in `src/features/auth/AuthContext.tsx`
- [ ] T011 Create generic Repository/Service layer for Dexie Entities in `src/lib/repository.ts`
- [ ] T012 Implement basic "Last-Write-Wins" Sync Service (Dexie <-> Firestore) in `src/lib/sync.ts`
- [ ] T013 Create App Layout component (Sidebar/Navigation, Header) in `src/components/layout/AppLayout.tsx`
- [ ] T014 Set up fundamental Routing (React Router) in `src/App.tsx` (Routes: Home, Matrix, DailyPlan)

**Checkpoint**: App runs, User can Login (Google), DB exists in browser (IndexedDB).

---

## Phase 3: User Story 1 - Categories & Task Creation (Priority: P1)

**Goal**: Users can create Categories and Tasks (defaulting to Q4).
**Entities**: Category, Task.

### Implementation for User Story 1

- [ ] T038 [P] [US1] Implement unit tests for `useTask` hook (CRUD & Q4 default) in `src/hooks/__tests__/useTask.test.ts`
- [ ] T015 [P] [US1] Create `CategoryList` component to display and add categories in `src/features/categories/CategoryList.tsx`
- [ ] T016 [P] [US1] Create `CreateTaskForm` component (Title, Desc, Eisenhower Select) in `src/features/tasks/CreateTaskForm.tsx`
- [ ] T017 [US1] Implement `useTask` hook for CRUD operations (Create defaults to Q4) in `src/hooks/useTask.ts`
- [ ] T018 [US1] Implement `EisenhowerMatrix` read-only component (4 Quadrants grid) in `src/features/tasks/EisenhowerMatrix.tsx`
- [ ] T019 [US1] Integrate Category and Task creation flow in Home Page
- [ ] T020 [US1] Add visual indicators (Colors/Badges) for Eisenhower Quadrants in `src/components/ui/badge.tsx`

**Checkpoint**: User can create categories, add tasks, and see them distributed in the Matrix view.

---

## Phase 4: User Story 2 - Sub-tasks & Auto-Completion (Priority: P2)

**Goal**: Granular task breakdown and auto-completion logic.
**Entities**: Task, SubTask.

### Implementation for User Story 2

- [ ] T039 [P] [US2] Implement unit tests for Auto-Completion logic in `src/lib/__tests__/repository.test.ts`
- [ ] T021 [P] [US2] Create `SubTaskList` component within Task Detail view in `src/features/tasks/SubTaskList.tsx`
- [ ] T022 [P] [US2] Implement Sub-task creation logic (independent check status) in `src/hooks/useSubTask.ts`
- [ ] T023 [US2] Implement Auto-Completion Logic: Trigger Task update when all Sub-tasks are checked in `src/lib/repository.ts` (or database hook)
- [ ] T024 [US2] Update Task list UI to show Sub-task progress (e.g., "2/3") in `src/features/tasks/TaskItem.tsx`
- [ ] T025 [US2] Implement "Dimmed" style for completed items (Task & SubTask) in `src/features/tasks/TaskStyles.ts`

**Checkpoint**: User can split tasks into sub-tasks; finishing all sub-tasks marks parent as done.

---

## Phase 5: User Story 3 - Daily Plan & Ordering (Priority: P3)

**Goal**: Manual planning, dragging tasks to days, and rollover logic.
**Entities**: DailyPlanItem.

### Implementation for User Story 3

- [ ] T040 [P] [US3] Implement unit tests for Rollover Service logic in `src/lib/__tests__/rollover.test.ts`
- [ ] T041 [P] [US3] Implement unit tests for Manual Reordering logic in `src/hooks/__tests__/useDailyPlan.test.ts`
- [ ] T026 [P] [US3] Create `DailyPlanView` component (Date selector + List) in `src/features/daily-plan/DailyPlanView.tsx`
- [ ] T027 [P] [US3] Implement `DraggableTask` wrapper using `dnd-kit` for Items in `src/components/dnd/DraggableTask.tsx`
- [ ] T028 [US3] Implement "Hybrid Drag Logic": Allow dragging Sub-task if exists, else Task, in `src/features/daily-plan/DragLogic.ts`
- [ ] T029 [US3] Implement Drop Zone in Daily Plan to create `DailyPlanItem` records in `src/features/daily-plan/PlanDropZone.tsx`
- [ ] T030 [US3] Implement Manual Reordering logic (updating `orderIndex`) in `src/hooks/useDailyPlan.ts`
- [ ] T031 [US3] Implement "Rollover" Service: On load, check previous day's unfinished items and move to today (Top pinned) in `src/lib/rollover.ts`
- [ ] T032 [US3] Add Toggle switch to view Daily Plan sorted by Eisenhower Priority vs Manual Order in `src/features/daily-plan/PlanToolbar.tsx`

**Checkpoint**: Full "Agile" cycle: Plan day, drag items, reorder, auto-rollover unfinished work.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: UX refinements and final validation.

- [ ] T033 [P] Audit and refine Accessibility (ARIA labels) for DnD components
- [ ] T034 [P] Optimize PWA caching strategies in `vite.config.ts` (Vite PWA plugin)
- [ ] T035 Verify "Offline Mode" behavior (disconnect network and test CRUD)
- [ ] T036 Clean up console logs and unused imports
- [ ] T037 Add final "Archive" action for completed tasks to hide them from lists

---

## Dependencies

1. **Setup (T001-T008)**: Independent.
2. **Foundation (T009-T014)**: Blocked by Setup. Blocks ALL Stories.
3. **US1 (T015-T020)**: Blocked by Foundation.
4. **US2 (T021-T025)**: Blocked by US1 (needs Task entity).
5. **US3 (T026-T032)**: Blocked by US2 (needs Sub-task logic for hybrid drag).

---

## Implementation Strategy

### MVP First (Phases 1-3)
Focus on simply creating Categories and Tasks (US1) with Google Auth (Foundation). This proves the stack (Dexie/Firebase) works.

### Incremental Logic (Phase 4)
Add the complexity of Sub-tasks and Auto-completion. This refines the data model.

### Full Application (Phase 5)
Add the "Daily Plan" view, which is the primary interactive surface. This is the most complex UI phase involving `dnd-kit`.
