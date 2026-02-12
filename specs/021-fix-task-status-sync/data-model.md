# Data Model: Task Status Synchronization

**Feature**: 021-fix-task-status-sync
**Status**: Stable (Logic Update Only)

## Entities

The existing entities `Task` and `SubTask` remain unchanged in structure. This update focuses on the **state transition logic**.

### Task (Existing)
- `id`: UUID
- `status`: `'TODO' | 'DONE' | 'ARCHIVED'`
- `completedAt`: ISO String (optional)

### SubTask (Existing)
- `id`: UUID
- `taskId`: UUID (Reference to Task)
- `isCompleted`: Boolean

## State Transitions

### Parent Task Status Rollup logic

The status of a `Task` is strictly tied to its `SubTasks`.

| Event | Logic | Resulting Task Status |
|-------|-------|----------------------|
| SubTask Created | If `Task.status !== 'ARCHIVED'` | Re-evaluate rollup |
| SubTask Updated | If `Task.status !== 'ARCHIVED'` | Re-evaluate rollup |
| SubTask Deleted | If `Task.status !== 'ARCHIVED'` | Re-evaluate rollup |
| Task Manual Update | If `Task.status` set to `DONE` | Check subtasks; Revert to `TODO` if any subtask is incomplete. |

### Rollup Rules
1. If a Task has **one or more** subtasks:
   - If **ALL** subtasks have `isCompleted === true`, Task status MUST be `'DONE'`.
   - If **ANY** subtask has `isCompleted === false`, Task status MUST be `'TODO'`.
2. If a Task has **zero** subtasks:
   - Task status remains unchanged (maintains its current `'TODO'` or `'DONE'` state as set manually).

## Constraints
- Archiving a task (`status: 'ARCHIVED'`) stops all auto-status synchronization for that task.
- **Strict Enforcement**: A Task cannot be manually marked as `DONE` if it contains any incomplete subtasks.
