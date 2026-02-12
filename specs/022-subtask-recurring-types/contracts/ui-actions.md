# UI Action Contracts: Recurring SubTasks

## SubTask Management

### `createSubTask(taskId, title, type, repeatLimit)`
- **Input**:
    - `taskId`: string
    - `title`: string
    - `type`: 'one-time' | 'multi-time' | 'daily'
    - `repeatLimit`: number (optional, default 1)
- **Output**: `SubTask` object
- **Side Effects**:
    - Syncs parent task status (if one-time).

### `updateSubTask(id, updates)`
- **Input**:
    - `id`: string
    - `updates`: `Partial<SubTask>`
- **Side Effects**:
    - Recalculates progress if `type` or `repeatLimit` changes.
    - Syncs parent task status (if one-time).

## Daily Plan Management

### `togglePlanItemCompletion(itemId, isCompleted)`
- **Input**:
    - `itemId`: string (DailyPlanItem ID)
    - `isCompleted`: boolean
- **Side Effects**:
    - If `refType === 'SUBTASK'` and linked `SubTask.type === 'one-time'`:
        - Updates `SubTask.isCompleted` to match.
        - Triggers `syncParentTaskStatus`.
    - Else (Multi-time/Daily):
        - Only updates `DailyPlanItem.isCompleted`.

### `addToPlan(date, refId, refType)`
- **Input**:
    - `date`: string
    - `refId`: string
    - `refType`: 'TASK' | 'SUBTASK'
- **Logic**:
    - Creates a new `DailyPlanItem`.
    - `isCompleted` defaults to `false`.
