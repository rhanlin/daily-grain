# UI Contracts: SubTask Chronic Ordering

## Action: Fetch Subtasks for Task Detail
**Trigger**: Entering `CategoryTaskDetail.tsx` or similar.
**Response**: An array of `SubTask` objects.
**Constraint**: The array MUST be sorted by `createdAt` ascending (oldest first).
**Implementation**: `repository.subtasks.getByTask(taskId)` using `sortBy('createdAt')`.

## Action: Fetch All Items for Eisenhower Matrix
**Trigger**: `EisenhowerMatrix.tsx` render.
**Response**: A flat array of `MatrixItem` objects.
**Constraint**: Subtasks within each quadrant MUST be sorted by `createdAt` ascending (oldest first).
**Implementation**: `db.subtasks.orderBy('createdAt').toArray()`.

## Action: Fetch Backlog Items
**Trigger**: `useBacklog` hook.
**Response**: A flat array of subtasks (to be displayed in the carousel).
**Constraint**: Subtasks MUST be grouped by `taskId`, and within each group, sorted by `createdAt`.
**Implementation**: Manual `sort` on the fetched array using the `subtaskComparator`.
