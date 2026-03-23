# Data Model: Backlog Routine Filter

## Logic Layer

### Filtered Backlog Data Projection
- **Inputs**: 
    - `groups: BacklogGroup[]` (from `useBacklog` hook)
    - `hideRoutine: boolean` (local UI state)
- **Output**: 
    - `filteredGroups: BacklogGroup[]`
- **Rules**:
    1. If `hideRoutine` is `false`, return `groups` unchanged.
    2. If `hideRoutine` is `true`:
        - For each `group` in `groups`:
            - Filter `group.subtasks` to exclude items where `type === 'daily'`.
            - Keep the `group` only if its filtered `subtasks` array is not empty.
        - Return the array of remaining `groups`.

### Entity Mapping
- **SubTask**: `type` attribute is the discriminator.
- **BacklogGroup**: Derived container representing a Category and its eligible Tasks/SubTasks.
