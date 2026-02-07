# Research: Task UI Refinement

**Feature**: Task UI Refinement
**Status**: Complete

## Executive Summary
This feature refines the Eisenhower Matrix view by defaulting to Task-level visibility and updates the Task Management (Category) UI to a square-card, two-column layout with Drag-and-Drop (DnD) reordering support. Mobile UX is optimized by fine-tuning dnd-kit sensors and preventing browser scroll interference.

## Technical Findings

### 1. Eisenhower View Filtering
- **Decision**: Update `MatrixPage` or its data-fetching hook to default the filter state to `level: 'TASK'`.
- **Rationale**: User explicitly requested Task-level as default. Existing FAB filter menu should be preserved to allow toggling to Subtask level.
- **Integration**: Requires checking `src/pages/MatrixPage.tsx` and related hooks.

### 2. Category Card Layout
- **Decision**: Use Tailwind CSS `aspect-square` for category cards.
- **Decision**: Apply `grid-cols-2` for mobile responsive grid in `CategoryOverview.tsx`.
- **Rationale**: Standard mobile-first approach for dense information display.

### 3. Category Reordering (DnD)
- **Decision**: Implement `@dnd-kit/core` and `@dnd-kit/sortable` in `CategoryOverview.tsx`.
- **Decision**: Add `orderIndex` field to the `categories` table in IndexedDB.
- **Rationale**: Project already uses `dnd-kit` for Daily Plan reordering. Reusing the same library maintains technical consistency.
- **Migration**: A DB migration (schema v3) is needed to add `orderIndex`. Existing categories should be initialized based on `createdAt` ascending.

### 4. Mobile Gesture Optimization (Bug Fix)
- **Problem**: Native browser scrolling and "pull-to-refresh" interfere with dnd-kit's TouchSensor on mobile, causing background displacement and sorting failure.
- **Decision**: Standardize `TouchSensor` delay to **150ms** with a **5px** tolerance.
- **Decision**: Apply `touch-action: none` to the draggable category cards via CSS during drag or globally on the item if it doesn't interfere with vertical scroll of the container.
- **Rationale**: Matches `DailyPlanPage` settings and ensures coordinate stability.

## Technical Decisions

### Decision: DB Migration for `orderIndex`
- **Rationale**: Required for persistent sorting.
- **Action**: Update `src/lib/db.ts` to v3 and add `orderIndex` to `categories` store.

### Decision: Sync Sort Logic in Repository
- **Rationale**: Centralize sorting logic.
- **Action**: Add `updateOrder` method to `repository.categories` in `src/lib/repository.ts`.

## Open Questions / Risks
- **Handle DnD vs. Click**: Ensuring that dragging doesn't trigger navigation to category details.
- **Mitigation**: Using 150ms delay correctly separates "tap" from "long-press-to-drag".

## Plan Updates
- Update `src/lib/db.ts` (Migration).
- Update `src/lib/repository.ts` (Sort methods).
- Refactor `src/features/categories/CategoryCard.tsx` (CSS/Layout, `touch-action: none`).
- Refactor `src/features/categories/CategoryOverview.tsx` (DnD implementation, `TouchSensor` tuning).
- Update `src/pages/MatrixPage.tsx` (Default filter).