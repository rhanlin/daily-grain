# Implementation Tasks: Fix Mobile Calendar Drawer Overflow

**Feature**: `019-fix-mobile-calendar-overflow`
**Status**: Pending
**Input**: Feature specification from `specs/019-fix-mobile-calendar-overflow/spec.md`

## Phase 1: Setup
*Goal: Prepare the environment for verification.*

- [x] T001 Review `src/features/daily-plan/DailyPlanDateSelector.tsx` to identify current padding and layout constraints

## Phase 2: Foundational
*Goal: Address cross-cutting style issues if any.*

- [x] T002 [P] Verify `src/components/ui/calendar.tsx` accepts `className` props correctly for responsive overrides

## Phase 3: Fix Mobile Calendar Drawer Layout (Priority: P1)
*Goal: Ensure the calendar component fits within the Drawer on mobile devices (US1).*
*Independent Test: Open Daily Plan on a mobile viewport (<375px), click date, verify calendar is fully visible without scrolling.*

### Styling & Layout
- [x] T003 [US1] Remove excessive padding (e.g., `p-4`) from the `DrawerContent` wrapper in `src/features/daily-plan/DailyPlanDateSelector.tsx`
- [x] T004 [US1] Apply `w-full`, `max-w-[calc(100vw-2rem)]`, and `mx-auto` constraints to the `Calendar` component in `src/features/daily-plan/DailyPlanDateSelector.tsx`
- [x] T005 [US1] Ensure the `Drawer` component in `src/features/daily-plan/DailyPlanDateSelector.tsx` respects safe-area insets (verify `vaul` behavior or add `pb-safe`)

### Verification
- [x] T006 [US1] Verify the fix on a simulated mobile viewport (e.g., iPhone SE dimensions 320px/375px) using the dev server

## Phase 4: Polish & Cross-Cutting Concerns
*Goal: Final verification and edge case handling.*

- [x] T007 [Polish] Ensure `Calendar` day cells scale down gracefully on very small screens (320px) by testing `DailyPlanDateSelector` rendering
- [x] T008 [Polish] Verify no regression on Desktop `Popover` view in `src/features/daily-plan/DailyPlanDateSelector.tsx`

## Dependencies
1. **US1** requires **T001** (Analysis)
2. **Polish** requires **US1** completion

## Parallel Execution Examples
- **T003** (Padding removal) and **T002** (Component check) can be done independently.
- **T007** (Small screen verification) can be done alongside **T006** (General verification).

## Implementation Strategy
- **MVP**: Focus strictly on `DailyPlanDateSelector.tsx` padding and width constraints.
- **Incremental**: Only touch `src/components/ui/calendar.tsx` if overriding styles via props fails.
