# Data Model: Task Status Engine

## Logic Layer Entities

### Task Status Engine (Virtual)
The logic responsible for calculating `Task.status` based on child `SubTask` states.

| Input Entity | Field Used | Criteria for "Effective Done" |
|--------------|------------|-------------------------------|
| SubTask | `type` | Affects evaluation logic. |
| SubTask | `isCompleted` | **Primary Override**: If true, SubTask is DONE regardless of type/count. |
| SubTask | `completedCount` | **Secondary (Multi-time)**: If `isCompleted` is false, check `completedCount >= repeatLimit`. |
| SubTask | `repeatLimit` | Threshold for 'multi-time'. |

## State Transition Matrix

| Current State | Event | Trigger Condition | New State |
|---------------|-------|-------------------|-----------|
| TODO | SubTask Done | ALL subs are effectively done | DONE |
| TODO | Manual Done | User action on Task | DONE |
| TODO | Daily Manual Done | User checks Daily SubTask (definition) | Re-eval (Possible DONE) |
| DONE | SubTask Added | New subtask created (default incomplete) | TODO |
| DONE | Progress Decr | `completedCount` falls below limit AND `isCompleted` is false | TODO |
| DONE | Manual TODO | User action on Task | TODO |
| DONE | Daily Uncheck | User unchecks Daily SubTask (definition) | TODO |

## Data Consistency Rules
1. **Manual DONE Sync**: `UPDATE subtasks SET isCompleted = true WHERE taskId = ? AND type = 'one-time'`.
2. **Preserve History**: `multi-time` and `daily` subtask progress MUST NOT be altered by Task status changes (unless user explicitly edits the subtask).
