# UI Contracts: Daily Plan UX Enhancement

## Actions

### `onSwipeLeft`
- **Trigger**: Horizontal swipe from right to left on the task list.
- **Outcome**: `selectedDate` updates to `D + 1`. Task list slides out to the left and new list slides in from the right.

### `onSwipeRight`
- **Trigger**: Horizontal swipe from left to right on the task list.
- **Outcome**: `selectedDate` updates to `D - 1`. Task list slides out to the right and new list slides in from the left.

### `openEditDialog`
- **Trigger**: Click "編輯標題" in the item's `Drawer` menu.
- **Outcome**: Drawer closes, `isEditingTitle` becomes true, `editTitleValue` is populated with current title.

### `submitTitleUpdate`
- **Trigger**: Click "確認" in the Edit Dialog.
- **Outcome**: If `refType` is 'TASK', call `repository.tasks.update`. If 'SUBTASK', call `repository.subtasks.update`. Dialog closes.

## Components

### `EditTitleDialog`
- **Props**: `open`, `onOpenChange`, `title`, `onConfirm`.
- **UI**: Standard Dialog with Input and Save/Cancel buttons.
