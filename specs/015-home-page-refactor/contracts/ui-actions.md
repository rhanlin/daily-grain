# UI Actions: Home Page Refactor

## Global Navigation
- **Action**: User clicks root logo or "每日計畫" nav item.
- **Outcome**: Navigation to `/`.

## Backlog Empty State
- **Trigger**: `useBacklog` returns empty groups.
- **Component**: `src/features/daily-plan/BacklogContent.tsx`.
- **Action**: Click `Button` with text "前往任務管理".
- **Execution**:
    1. Call `navigate('/management')`.
    2. Invoke `onClose()` (prop passed from `DailyPlanPage`).

## Labels Update
- Replace all instances of `主題分類` with `任務管理`.
- Target files:
    - `src/components/layout/AppLayout.tsx`
    - `src/pages/HomePage.tsx`
    - `src/features/categories/CategoryOverview.tsx`
