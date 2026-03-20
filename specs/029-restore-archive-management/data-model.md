# Data Model: Restore Archive Management

## Updated Entities

### SubTask (Modified)
*Fields*:
- `isArchived`: boolean (New) - **Index required**.
- (Other existing fields: `id`, `taskId`, `title`, `isCompleted`, `type`, `repeatLimit`, `eisenhower`, `createdAt`, `updatedAt`)

### Task (Existing)
*Fields*:
- `status`: `'TODO' | 'DONE' | 'ARCHIVED'`

### Category (Existing)
*Fields*:
- `isArchived`: boolean

## Logic: Archival Visibility Rules

| Component | Query Logic |
|-----------|-------------|
| **Backlog** | Exclude `Category.isArchived`, `Task.status === 'ARCHIVED'`, and `SubTask.isArchived` |
| **Daily Plan** | Exclude `DailyPlanItem` if its reference target is archived. |
| **Archive View** | Include only items where `isArchived === true` or `status === 'ARCHIVED'`. |

## Migration (Schema v6)
- Table `subtasks`: `'id, taskId, updatedAt, createdAt, type, title, isArchived'`
- Operation: `modify(s => s.isArchived = s.isArchived || false)`
