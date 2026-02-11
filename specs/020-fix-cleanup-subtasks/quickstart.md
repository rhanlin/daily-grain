# Quickstart: Verifying Task Cleanup

## Overview
This feature fixes orphaned sub-tasks appearing in the Backlog when their parent Task is deleted or archived.

## Verification Steps

### 1. Test Cascading Delete
1. Create a new Task.
2. Add 2 sub-tasks to it.
3. Open the "Daily Plan" -> "Add Task" (Backlog Drawer).
4. Verify sub-tasks are visible.
5. Delete the parent Task (from Category detail or Task view).
6. Re-open the Backlog Drawer.
7. **Expectation**: Sub-tasks and the Task are completely gone.

### 2. Test Archival Visibility
1. Create a new Task with 1 sub-task.
2. Archive the Task.
3. Open the Backlog Drawer.
4. **Expectation**: Neither the Task nor its sub-task should appear in the Backlog Drawer.

### 3. Test Daily Plan Cleanup
1. Create a Task and a Sub-task.
2. Add both to today's Daily Plan.
3. Delete the parent Task.
4. **Expectation**: Both items are automatically removed from the Daily Plan list.

## Development Setup
- No new environment variables.
- Standard `npm run dev`.
