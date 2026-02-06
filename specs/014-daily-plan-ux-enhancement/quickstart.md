# Quickstart: Verifying Daily Plan UX Enhancements

## Prerequisites
- Mobile device or Chrome DevTools (Mobile Mode).
- At least two days with scheduled tasks.

## Verification Steps

### 1. Horizontal Swipe
1. Open the Daily Plan page.
2. Swipe from right to left on the task list.
3. **Verify**: The date header updates to the next day, and the task list slides in from the right.
4. Swipe from left to right.
5. **Verify**: The date header updates to the previous day, and the task list slides in from the left.

### 2. Title Editing
1. Click the `MoreHorizontal` icon on any task or subtask.
2. **Verify**: The Drawer appears with an "編輯標題" option.
3. Click "編輯標題".
4. **Verify**: The Drawer closes and a Dialog appears with the current title in an input field.
5. Change the title and click "確認".
6. **Verify**: The Dialog closes and the task list immediately reflects the new title.
7. Repeat for a SubTask.
