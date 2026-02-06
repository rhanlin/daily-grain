# Research: Home Page Refactor & Terminology Update

**Feature**: Home Page Refactor & Terminology Update
**Status**: Complete

## Executive Summary
This feature involves a major structural change to the application's entry point and a global rename of a core concept. The root path will now serve the Daily Plan, and "Category Overview" (主題分類) will be renamed to "Task Management" (任務管理) and moved to a secondary route. Additionally, a new UX hook is added to guide users from an empty backlog to task creation.

## Technical Findings

### 1. Routing & Entry Point
- **Current Root (`/`)**: Points to `HomePage.tsx` (which renders `CategoryOverview`).
- **New Root (`/`)**: Should point to `DailyPlanPage.tsx`.
- **New Management Path**: The original `HomePage` logic should move to `/management`.
- **Decision**: Swap the route definitions in `App.tsx`.

### 2. Terminology Update
- **Target String**: "主題分類" -> "任務管理".
- **Locations**:
    - `AppLayout.tsx` (Nav labels)
    - `HomePage.tsx` (Internal naming/comments)
    - `CategoryOverview.tsx` (UI headers)
    - Any tooltips or placeholders.
- **Decision**: Perform a safe find-and-replace for display strings. Keep variable names (like `categoryId`, `Category`) as-is to avoid unnecessary breaking changes in the DB layer.

### 3. Backlog Empty State Button
- **Component**: `BacklogContent.tsx`.
- **Logic**: In the `groups.length === 0` branch, add a `Button` from Shadcn UI.
- **Navigation**: Use `useNavigate` from `react-router-dom`.
- **Interaction**: The Drawer needs to close when the button is clicked. Since `BacklogContent` is a child of the Drawer, it needs a `onClose` callback or simply trigger navigation which usually handles context well, but an explicit close is cleaner.

## Technical Decisions

### Decision: Route Mapping
- `/` -> `DailyPlanPage`
- `/management` -> `HomePage` (formerly Theme Categories)
- **Rationale**: Direct user focus to daily action immediately upon app launch.

### Decision: Component Renaming vs. Display Renaming
- **Decision**: Only update UI labels and documentation.
- **Rationale**: Renaming the actual component files or DB entities (Category) is out of scope for a UX/Terminology refactor and introduces regression risk.

## Open Questions / Risks
- **Redirects**: Should we keep `/daily-plan` as a redirect?
- **Decision**: Yes, for backward compatibility with existing browser history/bookmarks.

## Plan Updates
- Update `src/App.tsx` routes.
- Update `src/components/layout/AppLayout.tsx` navigation.
- Modify `src/features/daily-plan/BacklogContent.tsx` empty state.
