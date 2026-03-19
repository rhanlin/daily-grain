# Research: SubTask Chronic Ordering

## Decision: Dual-Level Sorting Strategy

### 1. Sorting Consistency (Dexie vs Memory)
**Decision**: Use `db.subtasks.orderBy('createdAt').toArray()` for single-task views, but perform in-memory sorting for complex views like the Backlog.
**Rationale**: Dexie's `orderBy` requires a defined index. While `createdAt` is indexed, combining it with `taskId` filtering and group-by logic in a single query is complex and often less performant than fetching the relevant set and sorting in memory for the data volumes expected in this app (< 1000 subtasks).
**Alternatives considered**: 
- Compound Index `[taskId+createdAt]`: Rejected because it adds schema complexity for a simple UI fix.
- `Collection.sortBy()`: This is actually an in-memory sort provided by Dexie anyway.

### 2. Fallback Logic (createdAt -> updatedAt -> id)
**Decision**: Use a robust comparison function: `(a, b) => (a.createdAt || a.updatedAt || '').localeCompare(b.createdAt || b.updatedAt || '') || a.id.localeCompare(b.id)`.
**Rationale**: Ensures absolute stability even for legacy data or simultaneous creations.
**Alternatives considered**: Only sorting by `createdAt`. Rejected because legacy data (pre-v2) might have empty `createdAt`.

### 3. Backlog Grouping
**Decision**: In the `useBacklog` hook, group subtasks by `taskId` and then sort each group by the established fallback logic.
**Rationale**: Maintains the relationship between parent tasks and their subtasks in the UI.
