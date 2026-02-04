# Research: Backlog Data Synchronization

## Finding: Aggressive Filtering in `useBacklog`
- **Issue**: The current implementation of `useBacklog` only returns tasks that have at least one visible subtask (`group.subtasks.length > 0`).
- **Impact**: Standalone tasks without subtasks are excluded from the Backlog, even if they are unscheduled. This leads to data inconsistency between the Home page (which shows all tasks) and the Daily Plan page.
- **Solution**: Refactor the grouping logic to include all unscheduled tasks and subtasks correctly.

## Finding: Redundant `planRefIds` Calculation
- **Issue**: Both `useBacklog` (DB query) and `BacklogContent` (prop derivation) calculate `planRefIds`.
- **Impact**: Potential race conditions or drift if the component's state and DB state are momentarily out of sync.
- **Solution**: Standardize on the DB state inside the `useBacklog` hook for all filtering logic.

## Finding: Reactive Query Coverage
- **Issue**: `useLiveQuery` correctly tracks top-level changes to `categories`, `tasks`, and `subtasks`.
- **Validation**: The reactivity should work as long as the queries are executed within the callback. The reported "lack of sync" is likely the result of the filtering logic described above rather than a failure of Dexie's observability.
