# Data Model: Task/Sub-task Cleanup Sync

## Entities

### Task (Updated Logic)
- **Table**: `tasks`
- **Fields**: (No schema change)
- **Behaviors**:
    - **Delete**: Triggers cascading delete of `SubTask` and `DailyPlanItem`.
    - **Archive**: Parent status change impacts visibility of child `SubTask`.

### SubTask (Updated Logic)
- **Table**: `subtasks`
- **Fields**: (No schema change)
- **Behaviors**:
    - **Visibility**: Dependent on parent `Task.status`. If parent is `ARCHIVED`, the SubTask is considered "Archived" by association.

### DailyPlanItem (Updated Logic)
- **Table**: `dailyPlanItems`
- **Fields**: (No schema change)
- **Behaviors**:
    - **Cleanup**: Must be removed if the target `refId` (Task or SubTask) is deleted.

## Relationships

- `Task` (1) <---> (N) `SubTask` (Linked by `taskId`)
- `Task`/`SubTask` (1) <---> (0..N) `DailyPlanItem` (Linked by `refId`)

## Validation Rules

- A `SubTask` MUST NOT exist without a corresponding `Task` entry in the database (Integrity check during deletion).
- A `DailyPlanItem` MUST NOT reference a non-existent `Task` or `SubTask`.
