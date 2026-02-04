# UI Contracts: Category-Level Multi-Select

## Actions

### `onSubTaskLongPress(subTaskId, categoryId)`
- **Target**: `DraggableItem` (internal component of `CategorySlide`).
- **Effect**: If not already in mode, set `activeCategoryId = categoryId`. Add `subTaskId` to `selectedIds`.

### `onToggleSelection(subTaskId, categoryId)`
- **Effect**: If `categoryId === activeCategoryId`, add/remove `subTaskId`.

## Component Props Update

### `CategorySlide`
- `isLocked: boolean` (Derived in `BacklogContent`).
- `selectedIds: Set<string>`.
- `onToggleSelection: Function`.
- `onStartSelection: Function`.