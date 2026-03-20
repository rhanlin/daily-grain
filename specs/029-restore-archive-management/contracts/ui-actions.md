# UI Actions: Restore Archive Management

## Feature: Archive Item

### Action: Archive Task
- **Trigger**: Click "Archive" in Task More Menu.
- **Repository**: `repository.tasks.update(id, { status: 'ARCHIVED' })`.
- **Result**: Item removed from active view.

### Action: Archive SubTask
- **Trigger**: Click "Archive" in SubTask menu.
- **Repository**: `repository.subtasks.update(id, { isArchived: true })`.
- **Result**: Item removed from active view.

## Feature: Manage Archive (Archive View)

### Action: List Archived Items
- **Query**: 
    - `db.categories.where('isArchived').equals(1).toArray()`
    - `db.tasks.where('status').equals('ARCHIVED').toArray()`
    - `db.subtasks.where('isArchived').equals(1).toArray()`

### Action: Restore Item
- **Logic**:
    - If Category: Set `isArchived = false`.
    - If Task: Set `status = 'TODO'`. If parent Category is archived, prompt user.
    - If SubTask: Set `isArchived = false`. If parent Task is archived, prompt user.

### Action: Permanent Delete
- **Behavior**: Call `db.table.delete(id)`.
- **Warning**: Show "This cannot be undone" dialog.
