# UI Contracts: Fix Swipe Conflict with Overlays

## Hook: `useSwipe`

### `onTouchStart` / `onTouchEnd`
- **Updated Logic**: If `disabled` is true, immediately return without setting coordinates or triggering callbacks.

## Component: `DailyPlanView`

### `swipeHandlers`
- **Updated Logic**: Pass `disabled: isEditing || !!actionItem` to the hook initialization.
