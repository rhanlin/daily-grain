# Quickstart: Verifying Swipe Conflict Fix

## Prerequisites
- Mobile browser or Chrome DevTools (Mobile Mode).
- A task with subtasks scheduled in Daily Plan.

## Verification Steps

### 1. Test Drawer Conflict
1. Open the Daily Plan page.
2. Click the `MoreHorizontal` icon on a task to open the Drawer.
3. While the Drawer is open, attempt to swipe horizontally on the background area.
4. **Verify**: The background date does NOT change.

### 2. Test Dialog Conflict
1. Open the Drawer for a task.
2. Click "編輯標題" to open the Dialog.
3. While the Dialog is open, attempt to swipe horizontally.
4. **Verify**: The background date does NOT change.

### 3. Test Normal Functionality
1. Close all Overlays.
2. Swipe horizontally on the task list.
3. **Verify**: Date navigation works as expected.
