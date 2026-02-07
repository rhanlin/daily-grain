# UI Contracts: Backlog and Rollover Fixes

## Backlog Selection Fixes

### `onSubTaskTap` (Updated)
- **Props**: `subTaskId`, `categoryId`.
- **Logic**: 
    - Check if gesture was a "tap" (no significant move).
    - If in multi-select mode, toggle ID in `selectedIds`.
    - Else, perform immediate "add to plan".

### `CategorySlide` Container
- **Class Update**: Conditional `pb-24` when `isSelectionMode` is active.

## Rollover Service

### `performRollover(prevDate, todayDate)`
- **Behavior**: Bulk insert of uncompleted items.
- **Contract**: Ensures `isRollover` flag is preserved/set.
