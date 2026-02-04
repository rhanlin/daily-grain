# Data Model: Refined Backlog View

## Entities & Relationships

This feature refactors the mapping logic between `Category`, `Task`, and `SubTask` for the Backlog display.

### BacklogGroup (View Model)
Refined structure returned by the `useBacklog` hook.

| Field | Type | Constraint |
|-------|------|------------|
| `category` | Category | `!isArchived` |
| `tasks` | Task[] | `!isArchived` AND has at least one visible subtask |
| `subtasks` | SubTask[] | `!isCompleted` AND `!isScheduled(any date)` |

## State Transitions & Filtering Rules

1.  **SubTask Visibility**:
    - `isCompleted === false`
    - `DailyPlanItem.where('refId').equals(subtask.id).count() === 0`
2.  **Task Visibility**:
    - `Task.categoryId === category.id`
    - `BacklogGroup.subtasks.filter(s => s.taskId === task.id).length > 0`
3.  **Category Visibility**:
    - `BacklogGroup.tasks.length > 0` (OR standalone tasks if that rule changes, but per spec US2, we hide empty containers).
