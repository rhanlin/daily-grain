# Quickstart: Restore Archive Management

## Setup for Testing
1. Ensure you have some active Categories, Tasks, and SubTasks.

## Verification Steps

### SC-001: Archiving Flow
1. Open a Task. 
2. Open the SubTask more menu -> Click "封存".
3. **Verify**: SubTask disappears from the list.
4. Open the Task more menu -> Click "封存".
5. **Verify**: Task disappears from the list.

### SC-002: Archive Management
1. Navigate to Category Management -> "已封存項目".
2. **Verify**: The archived Task and SubTask from previous steps are visible in the list.
3. Click "還原" (Restore) on the SubTask.
4. **Verify**: The SubTask is removed from the Archive list and reappears in its parent Task.

### SC-003: Cascade Handling
1. Archive a Category.
2. Go to Archive Management -> Tasks tab.
3. **Verify**: All tasks belonging to that category are now shown as archived.
4. Try to restore a Task whose Category is still archived.
5. **Verify**: System prompts that the Category must be restored first.
