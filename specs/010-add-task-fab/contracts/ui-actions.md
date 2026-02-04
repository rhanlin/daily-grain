# UI Contracts: Add Task FAB

## Actions

### `openCreateTaskDrawer`
- **Trigger**: Click on the FAB in Category Detail Page.
- **Payload**: `defaultCategoryId` set to the current `categoryId` from the URL parameters.
- **Expected Outcome**: `QuickCreateTaskDrawer` opens with the category pre-selected.

## Components

### `CategoryDetailPage`
- **Props**: None (uses URL params).
- **State**: `isCreateTaskOpen` (boolean).
- **Children**: 
    - Header
    - TaskList
    - FAB (Button)
    - `QuickCreateTaskDrawer`
