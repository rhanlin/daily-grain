# Data Model: Task Status Engine

## Logic Layer Entities

### Task Status Engine (Virtual)
The logic responsible for calculating `Task.status` based on child `SubTask` states.

| Input Entity | Field Used | Criteria |
|--------------|------------|----------|
| SubTask | `type` | If ANY == 'daily', status is pinned to TODO. |
| SubTask | `isCompleted` | Used for 'one-time' evaluation. |
| SubTask | `completedCount` | Derived from DailyPlanItems, used for 'multi-time'. |
| SubTask | `repeatLimit` | Threshold for 'multi-time'. |

## State Transition Matrix

| Current State | Event | Trigger Condition | New State |
|---------------|-------|-------------------|-----------|
| TODO | SubTask Done | ALL subs are done AND NO daily subs exist | DONE |
| TODO | Manual Done | User action | DONE |
| DONE | SubTask Added | New subtask created (default incomplete) | TODO |
| DONE | Progress Decr | `completedCount` falls below `repeatLimit` | TODO |
| DONE | Manual TODO | User action | TODO |

## Data Consistency Rules
1. **Manual DONE Sync**: `UPDATE subtasks SET isCompleted = true WHERE taskId = ? AND type = 'one-time'`.
2. **Preserve History**: `multi-time` and `daily` subtask progress MUST NOT be altered by Task status changes.
