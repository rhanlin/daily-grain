# Research: Add Task FAB on Mobile

**Feature**: Add Task FAB on Mobile
**Status**: Complete

## Executive Summary
The goal is to add a Floating Action Button (FAB) to the Category Detail Page on mobile devices. This FAB should function similarly to the "Add Category" FAB on the Home Page, triggering a drawer to create a new task. The new task should default to the current category.

## Technical Decisions

### 1. Reusing `QuickCreateTaskDrawer`
- **Decision**: Reuse the existing `QuickCreateTaskDrawer` component.
- **Rationale**: It already implements the "Add Task" logic using a Drawer, supports selecting a category, and accepts a `defaultCategoryId` prop. This perfectly matches the requirement to default to the current category.
- **Implementation**: Import `QuickCreateTaskDrawer` in `CategoryDetailPage.tsx`.

### 2. FAB Implementation
- **Decision**: Add a fixed-position `Button` component in `CategoryDetailPage.tsx`, visible only on mobile (using CSS or `react-use` media query).
- **Rationale**: Matches the implementation in `HomePage.tsx`.
- **Styling**: `fixed bottom-24 right-6 h-12 w-12 rounded-full shadow-2xl z-50`. This matches the Home Page FAB style.

### 3. Responsive Behavior
- **Decision**: Use `react-use`'s `useMedia` hook to conditionally render the FAB only on mobile devices (`max-width: 768px`).
- **Rationale**: The requirement specifically targets "Mobile", and desktop usually has other ways to add tasks (or the FAB might look out of place). The Home Page FAB seems to be present on all sizes based on the code, but for this specific "Mobile" requirement, explicit targeting is safer, or we can just leave it for all sizes if it follows the app's pattern. However, the spec says "Mobile", so I will ensure it's at least optimized for mobile.

## Implementation Details

### `CategoryDetailPage.tsx`
- Import `QuickCreateTaskDrawer`.
- State `isCreateTaskOpen` to control the drawer.
- Add the FAB button (Plus icon) at the bottom right.
- Pass `categoryId` from params to `QuickCreateTaskDrawer` as `defaultCategoryId`.

## Open Questions / Risks
- **Risk**: Overlapping with other fixed elements? (e.g., bottom nav if it exists). The Home Page uses `bottom-24`, suggesting there might be a bottom bar. `CategoryDetailPage` doesn't seem to have a bottom bar in the code I read, but sticking to `bottom-24` maintains consistency with Home Page.

