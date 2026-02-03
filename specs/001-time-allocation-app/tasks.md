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
- [x] T009 Install `react-use` and `sonner` for hooks and notifications (`npm install react-use sonner`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure (Database, Auth, Sync) that MUST be complete before UI work.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T010 Define Dexie database schema in `src/lib/db.ts` (Categories, Tasks, SubTasks, DailyPlanItems)
- [x] T011 Implement Authentication Context (`AuthProvider`) using Firebase Google Sign-In in `src/features/auth/AuthContext.tsx`
- [x] T012 Create generic Repository/Service layer for Dexie Entities in `src/lib/repository.ts`
- [x] T013 Implement basic "Last-Write-Wins" Sync Service (Dexie <-> Firestore) in `src/lib/sync.ts`
- [x] T014 Create App Layout component (Sidebar/Navigation, Header) in `src/components/layout/AppLayout.tsx`
- [x] T015 Set up fundamental Routing (React Router) in `src/App.tsx` (Routes: Home, Matrix, DailyPlan)

**Checkpoint**: App runs, User can Login (Google), DB exists in browser (IndexedDB).

---

## Phase 3: User Story 1 - Categories & Task Creation (Priority: P1)

**Goal**: Users can create, edit, and delete Categories and Tasks.
**Entities**: Category, Task.

### Implementation for User Story 1

- [x] T016 [P] [US1] Create `CategoryList` component to display and add categories in `src/features/categories/CategoryList.tsx`
- [x] T017 [P] [US1] Create `CreateTaskForm` component (Title, Desc, Eisenhower Select) in `src/features/tasks/CreateTaskForm.tsx`
- [x] T018 [US1] Implement `useTask` hook for CRUD operations (Create defaults to Q4) in `src/hooks/useTask.ts`
- [x] T019 [US1] Implement `EisenhowerMatrix` read-only component (4 Quadrants grid) in `src/features/tasks/EisenhowerMatrix.tsx`
- [x] T020 [US1] Integrate Category and Task creation flow in Home Page
- [x] T021 [US1] Add visual indicators (Colors/Badges) for Eisenhower Quadrants in `src/components/ui/badge.tsx`
- [x] T022 [P] [US1] Implement Edit (Rename) and Delete actions with Confirmation Dialog for **Categories** in `src/features/categories/CategoryList.tsx`
- [x] T023 [P] [US1] Implement Edit (Inline Icon) and Delete actions with Confirmation Dialog for **Tasks** in `src/features/tasks/TaskItem.tsx`
- [x] T024 [US1] Implement **Cascade Delete** logic in `src/lib/repository.ts` (Delete Category -> Soft Delete Tasks; Delete Task -> Delete Subtasks & Plan Items)
- [x] T025 [P] [US1] Refactor `CategoryList` to use Long Press for management actions on mobile (FR-032) in `src/features/categories/CategoryList.tsx`
- [x] T026 [P] [US1] Refactor `TaskItem` to use Long Press for management actions on mobile (FR-032) in `src/features/tasks/TaskItem.tsx`

**Checkpoint**: Full CRUD for Categories and Tasks with safe deletion and mobile-friendly interactions.

---

## Phase 4: User Story 2 - Sub-tasks & Auto-Completion (Priority: P2)

**Goal**: Granular task breakdown, auto-completion, and sub-task management.
**Entities**: Task, SubTask.

### Implementation for User Story 2

- [x] T027 [P] [US2] Create `SubTaskList` component within Task Detail view in `src/features/tasks/SubTaskList.tsx`
- [x] T028 [P] [US2] Implement Sub-task creation logic (independent check status) in `src/hooks/useSubTask.ts`
- [x] T029 [US2] Implement Auto-Completion Logic: Trigger Task update when all Sub-tasks are checked in `src/lib/repository.ts` (or database hook)
- [x] T030 [US2] Update Task list UI to show Sub-task progress (e.g., "2/3") in `src/features/tasks/TaskItem.tsx`
- [x] T031 [US2] Implement "Dimmed" style for completed items (Task & SubTask) in `src/features/tasks/TaskStyles.ts`
- [x] T032 [P] [US2] Implement Edit (Inline Icon) and Delete actions for **Sub-tasks** in `src/features/tasks/SubTaskList.tsx`
- [x] T033 [P] [US2] Refactor `SubTaskList` to use Long Press for management actions on mobile (FR-032, FR-033) in `src/features/tasks/SubTaskList.tsx`

**Checkpoint**: User can fully manage sub-tasks including editing and removing them, with mobile-optimized gestures.

---

## Phase 5: User Story 3 - Daily Plan & Ordering (Priority: P3)

**Goal**: Manual planning, dragging tasks to days, backlog management, and rollover logic.
**Entities**: DailyPlanItem.

### Implementation for User Story 3

- [x] T034 [P] [US3] Create `DailyPlanView` component (Date selector + List) in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T035 [P] [US3] Implement `DraggableTask` wrapper using `dnd-kit` for Items in `src/components/dnd/DraggableTask.tsx`
- [x] T036 [US3] Implement Drop Zone in Daily Plan to create `DailyPlanItem` records in `src/features/daily-plan/PlanDropZone.tsx`
- [x] T037 [US3] Implement Manual Reordering logic (updating `orderIndex`) in `src/hooks/useDailyPlan.ts`
- [x] T038 [US3] Implement "Rollover" Service: On load, check previous day's unfinished items and move to today (Top pinned) in `src/lib/rollover.ts`
- [x] T039 [US3] Add Toggle switch to view Daily Plan sorted by Eisenhower Priority vs Manual Order in `src/features/daily-plan/PlanToolbar.tsx`
- [x] T040 [US3] Refine DailyPlan interaction: **Disable click-to-add**, enforce **Unique Items per Day** in `src/hooks/useDailyPlan.ts`
- [x] T041 [US3] Implement **Remove from Plan** action (X Icon) in `src/features/daily-plan/DailyPlanView.tsx`
- [x] T042 [US3] Update **Backlog Logic**: Filter out items that are already in the *current* daily plan or completed in `src/pages/DailyPlanPage.tsx`
- [x] T043 [US3] Implement **Responsive Layout**: Use `react-use`'s `useMedia` to switch between Sidebar (Desktop) and Drawer (Mobile) for Backlog (FR-015) in `src/pages/DailyPlanPage.tsx`
- [x] T044 [US3] Implement **Mobile Interaction**: Tap-to-Add for Backlog items with Toast feedback (FR-030) in `src/pages/DailyPlanPage.tsx`
- [x] T045 [US3] Position **FAB** correctly above mobile navigation (FR-031) in `src/pages/DailyPlanPage.tsx`
- [x] T046 [US3] Implement **Conflict Detection & Confirmation** for moving scheduled items (FR-029) in `src/pages/DailyPlanPage.tsx`
- [x] T047 [US3] Implement **Visual Hints** (Calendar Icon + Tooltip) for scheduled backlog items (FR-028) in `src/pages/DailyPlanPage.tsx`
- [x] T048 [US3] Update `DailyPlanView` to use Long Press for "Remove" action on mobile (FR-032) in `src/features/daily-plan/DailyPlanView.tsx`

**Checkpoint**: Robust planning experience with responsive design, mobile-optimized interactions, and conflict handling.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: UX refinements and final validation.

- [x] T049 [P] Audit and refine Accessibility (ARIA labels) for DnD components
- [x] T050 [P] Optimize PWA caching strategies in `vite.config.ts` (Vite PWA plugin)
- [x] T051 Verify "Offline Mode" behavior (disconnect network and test CRUD)
- [x] T052 Clean up console logs and unused imports
- [x] T053 [Polish] Implement **Matrix Focus Mode** (dim unrelated items) and **View Filters** (Task/Subtask/All) in `src/features/tasks/EisenhowerMatrix.tsx`
- [x] T054 [Polish] Verify Event Propagation: Ensure Long Press on nested items (Subtask) does NOT trigger parent (Task) actions (FR-033).

---

## Dependencies

1. **Setup (T001-T009)**: Independent.
2. **Foundation (T010-T015)**: Blocked by Setup. Blocks ALL Stories.
3. **US1 (T016-T026)**: Blocked by Foundation.
4. **US2 (T027-T033)**: Blocked by US1 (needs Task entity).
5. **US3 (T034-T048)**: Blocked by US2 (needs Sub-task logic).

---

## Implementation Strategy

### Mobile-First Refinement
The implementation has shifted to heavily prioritize mobile UX. Key components (`DailyPlanPage`, `CategoryList`, `TaskItem`) have been refactored to use `useMedia` for responsive behavior and `useLongPress` for touch-friendly management.

### React-Use Adoption
We have standardized on `react-use` for hooks (like `useMedia`, `useLongPress`) to avoid custom implementations and ensure reliability.

### Feedback Loop
All mobile actions (like adding to plan) now provide immediate feedback via Toast notifications (`sonner`) to satisfy the "Immediate Feedback" design principle.