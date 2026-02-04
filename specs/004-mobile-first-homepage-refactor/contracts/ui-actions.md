# API Contract: Mobile Home UI Actions

## Quick Create Task (Global Drawer)
Triggered by the FAB on the `HomePage`.

- **Action**: `createTask`
- **Component**: `QuickCreateTaskDrawer`
- **Inputs**: 
  - `title`: String (Required)
  - `categoryId`: UUID (Optional, defaults to first active category)
- **Response**: `Task` object + Toast notification.

## Category Navigation (Drill-down)
Triggered by tapping a card on the `HomePage`.

- **Action**: `navigate`
- **Input**: `categoryId`
- **Outcome**: URL change to `/category/:categoryId`.
