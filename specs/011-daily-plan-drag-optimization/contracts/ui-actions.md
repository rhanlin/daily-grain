# Contract: UI Actions (Daily Plan Optimization)

## Actions

### `onDragStart`
- **Trigger**: User touches and holds the `DragHandle`.
- **Pre-condition**: `isMobile` is detected.
- **Outcome**: Item enters sortable state; visual feedback (scaling/shadow) applied.

### `openActionMenu`
- **Trigger**: Click on `MoreHorizontal` button (replaces long-press).
- **Outcome**: `Drawer` (mobile) or `Dropdown` (desktop) opens.

## Components

### `DailyPlanItem`
- **Required UI**: `DragHandle` (Left/Center-Left) and `MoreHorizontal` button (Far Right).
- **Behavior**: Draggable ONLY via Handle. Menu ONLY via Button.

### `TouchSensor`
- **Configuration**: Delay 150ms, Tolerance 5px.
