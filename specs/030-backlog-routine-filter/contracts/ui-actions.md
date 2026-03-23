# UI Actions: Backlog Routine Filter

## Action: Toggle Routine Filter in Backlog
**Trigger**: Click the "隱藏每日" Switch in the Backlog Drawer.
**State**: `hideRoutine: boolean` (managed by `useState` in `Backlog` component).
**Behavior**: 
1. Update local state.
2. Trigger re-filtering of the displayed backlog groups.
3. UI re-renders with the filtered set within 100ms.

## Action: Close Backlog Drawer
**Trigger**: User clicks backdrop or close button.
**Behavior**: 
1. Component unmounts.
2. Local state `hideRoutine` is lost (resets to default `false` on next mount).
