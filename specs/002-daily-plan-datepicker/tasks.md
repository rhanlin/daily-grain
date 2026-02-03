---
description: "Task list for Daily Plan Date Picker"
---

# Tasks: 002-daily-plan-datepicker

**Input**: Design documents from `/specs/002-daily-plan-datepicker/`
**Prerequisites**: plan.md (required), spec.md (required).

**Architecture**: React (Vite), Shadcn UI, Dexie.js.
**Frontend**: React 18+, TailwindCSS 4.
**Testing**: Vitest.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install necessary UI components.

- [x] T001 [P] Install Shadcn Calendar component (`npx shadcn@latest add calendar`)
- [x] T002 [P] Install Shadcn Popover component (`npx shadcn@latest add popover`)
- [x] T003 [P] Check/Install `date-fns` and `zh-TW` locale for Chinese date formatting

## Phase 2: User Story 1 - Date Navigation (Priority: P1)

**Goal**: Users can navigate dates using a responsive picker (Drawer on Mobile, Popover on Desktop).
**Entities**: `SelectedDate` (State).

### Implementation for User Story 1

- [x] T004 [US1] Create `src/features/daily-plan/DailyPlanDateSelector.tsx` component skeleton
- [x] T005 [US1] Implement Desktop view using `Popover` and `Calendar` in `DailyPlanDateSelector.tsx` (Ensure `zh-TW` locale is applied)
- [x] T006 [US1] Implement Mobile view using `Drawer` and `Calendar` in `DailyPlanDateSelector.tsx` (Ensure `zh-TW` locale is applied and reuse `useMedia` hook)
- [x] T007 [US1] Integrate `DailyPlanDateSelector` into `src/features/daily-plan/PlanToolbar.tsx`, replacing the static date header
- [x] T008 [US1] Ensure `onDateChange` prop correctly updates the `selectedDate` state in `DailyPlanPage`

**Checkpoint**: User can change the date, and the daily plan list updates accordingly.

## Phase 3: Polish & Cross-Cutting Concerns

**Purpose**: UX refinements and final validation.

- [x] T009 [Polish] Add visual feedback (hover styles, icon) to the Date Trigger button (FR-006)
- [x] T010 [Polish] Verify responsive behavior: resizing window switches between Popover and Drawer
- [x] T011 [Polish] Ensure the Calendar defaults to the currently selected date when opened (FR-005)

---

## Dependencies

1. **Setup (T001-T003)**: Independent.
2. **US1 (T004-T008)**: Blocked by Setup.
3. **Polish (T009-T011)**: Blocked by US1.

---

## Implementation Strategy

### Responsive Component
Build a single `DailyPlanDateSelector` component that internally uses `useMedia` (from `react-use`, per project principles) to render either the Mobile Drawer or Desktop Popover.

### State Management
Keep the `selectedDate` state in `DailyPlanPage` (lifting state up) and pass it down to the selector, ensuring the rest of the page (Plan list, Backlog) reacts to changes naturally.