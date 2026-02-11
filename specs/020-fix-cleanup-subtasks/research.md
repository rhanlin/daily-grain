# Research: Task/Sub-task Cleanup Sync

## Decision: Cascade Cleanup and Query Filtering

To resolve the orphaned sub-tasks bug, we will implement a two-pronged approach:

1. **Hard Delete Cascade**: When a `Task` is explicitly deleted, we will use a Dexie transaction to simultaneously delete all associated `SubTask` records and any `DailyPlanItem` records referencing the Task or its children.
2. **Archival Filtering**: When a `Task` status is set to `'ARCHIVED'`, the sub-tasks should remain in the database (to support future "unarchive" functionality) but must be filtered out of the Backlog and Daily Plan queries.

## Rationale

- **Data Integrity**: Cascading deletes prevent database bloat and "ghost" records that no longer have a parent.
- **Consistency**: The user expects that "Archive" preserves data while "Delete" destroys it. Filtering sub-tasks based on the parent Task's status is more robust than deleting sub-tasks upon archival, as it allows for restoration.
- **Performance**: Dexie transactions ensure atomic operations, preventing partial deletes. Filtering at the query level (e.g., using `useLiveQuery` with joined logic) is efficient enough for the current scale.

## Implementation Details

### Hard Delete (Deletion)
Update the `deleteTask` function in `repository.ts` to:
- Open a transaction on `tasks`, `subtasks`, and `dailyPlanItems`.
- Delete the `Task`.
- Find and delete all `SubTask` where `taskId === deletedTaskId`.
- Find and delete all `DailyPlanItem` where `refId === deletedTaskId` OR `refId` is in the list of deleted SubTask IDs.

### Soft Filtering (Archival)
Update the hooks that fetch sub-tasks (e.g., `useBacklog`, `useSubTask`) to:
- Join with the `tasks` table.
- Filter out sub-tasks whose parent task has `status === 'ARCHIVED'`.

## Alternatives Considered

- **Dexie Hooks (`hooking`)**: We could use Dexie's `deleting` hook to automate this. 
  - *Rejected*: Direct repository manipulation is more explicit and easier to debug within the current project structure.
- **Delete Sub-tasks on Task Archival**: 
  - *Rejected*: If the user unarchives the Task, they would lose all sub-task progress, which is a poor UX. Archival should be reversible.

## Dependencies

- **Dexie.js**: Already in use. No new dependencies required.
