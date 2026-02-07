# Data Model

This feature involves UI component updates and does not require changes to the persistent data model (IndexedDB).

## Component Props

### `DailyPlanDateSelector`

Located in: `src/features/daily-plan/DailyPlanDateSelector.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `selectedDate` | `string` | ISO Date string (YYYY-MM-DD) representing the currently active date. |
| `onDateChange` | `(date: string) => void` | Callback triggered when a user selects a new date from the calendar. |

### Internal State

- `isOpen`: `boolean` - Controls the visibility of the Drawer (Mobile) or Popover (Desktop).
- `isDesktop`: `boolean` - Derived from `useMedia` hook to toggle between Drawer/Popover.
