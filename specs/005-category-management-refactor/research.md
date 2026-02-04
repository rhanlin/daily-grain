# Research: Category Management Refactor

## Decision: Long-press Detection Hook
- **Decision**: Use `useLongPress` from `react-use`.
- **Rationale**: Standard library in the project, handles timing and cleanup efficiently.
- **Alternatives considered**: Native `onContextMenu` (limited mobile support), custom `setTimeout` (redundant implementation).

## Decision: Gesture Conflict Resolution
- **Decision**: Use a combination of `isLongPress` flag and `event.preventDefault()`.
- **Rationale**: To prevent the browser's default context menu and the React component's single-click (navigate) event from firing simultaneously.
- **Implementation Note**: The `onClick` handler should check if a long-press just occurred.

## Decision: FAB Transition
- **Decision**: Directly replace the `QuickCreateTaskDrawer` trigger with `CreateCategoryDrawer` on the Homepage FAB.
- **Rationale**: Aligns with the mobile-first "Organize first" UX principle requested by the user.
- **User Story Impact**: Tasks are now added *to* categories, making category creation the primary entry point on the high-level overview.
