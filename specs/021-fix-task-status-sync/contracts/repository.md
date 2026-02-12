# Internal API Contract: Repository Synchronization

**Feature**: 021-fix-task-status-sync

## SubTask Operations

### `create(taskId: string, title: string): Promise<SubTask>`
- **Side Effect**: Must trigger `syncParentTaskStatus`.

### `update(id: string, updates: Partial<SubTask>): Promise<void>`
- **Side Effect**: Must trigger `syncParentTaskStatus` if `isCompleted` is changed.

### `delete(id: string): Promise<void>`
- **Side Effect**: Must trigger `syncParentTaskStatus`.

## Task Operations

### `update(id: string, updates: Partial<Task>): Promise<void>`
- **Logic Refinement**: If `updates.status === 'DONE'`, the system MUST check if any subtasks are incomplete. If so, the status update to `DONE` MUST be blocked or overridden to `TODO`.

## Internal Helper

### `syncParentTaskStatus(taskId: string): Promise<void>`
- **Purpose**: Centralized logic for the rollup rules (TODO/DONE).
- **Rules**:
  - Fetch all subtasks for `taskId`.
  - If count > 0 and all are completed -> `Task.status = 'DONE'`.
  - If count > 0 and any incomplete -> `Task.status = 'TODO'`.
  - Transaction-safe.
