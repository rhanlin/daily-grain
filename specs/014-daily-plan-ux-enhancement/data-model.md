# Data Model: Daily Plan UX Enhancement

## Overview
This feature introduces transient UI states for swipe navigation and title editing. No schema changes are required in IndexedDB.

## UI State Models

### Swipe State
Managed by `useSwipe` hook.

| Field | Type | Description |
|-------|------|-------------|
| `touchStart` | `{ x: number, y: number } \| null` | Initial touch coordinates. |
| `touchEnd` | `{ x: number, y: number } \| null` | Final touch coordinates. |

### Edit State
Managed in `DailyPlanView`.

| Field | Type | Description |
|-------|------|-------------|
| `isEditingTitle` | boolean | Controls the visibility of the Edit Dialog. |
| `editTitleValue` | string | Current value in the edit input field. |
| `targetItem` | `DailyPlanItem \| null` | The item currently being edited. |

## Persistence Logic
- **Title Update**: Calls `repository.tasks.update(id, { title })` or `repository.subtasks.update(id, { title })`.
- **Date Navigation**: Updates the `selectedDate` state in `DailyPlanPage`.
