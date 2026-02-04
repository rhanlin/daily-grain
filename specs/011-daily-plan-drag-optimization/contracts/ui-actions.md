# Contract: UI Actions (Daily Plan Optimization)

## Actions

### `onDragStart`
- **Trigger**: User touches and holds the `DragHandle`.
- **Pre-condition**: `isMobile` is detected and `disabled` is false.
- **Outcome**: Item enters sortable state; visual feedback (scaling/shadow) applied; tactile vibration triggered.

### `openActionMenu`
- **Trigger**: Click on `MoreHorizontal` button (replaces long-press).
- **Outcome**: `Drawer` (mobile) or `Dropdown` (desktop) opens.

## Components

### `DailyPlanItem`
- **Required UI**: `DragHandle` (Left) and `MoreHorizontal` button (Far Right).
- **Behavior**: Draggable ONLY via Handle. Menu ONLY via Button.

### `SortableContext`
- **ID**: must be `'daily-plan'`.
- **Strategy**: `verticalListSortingStrategy`.

### `TouchSensor`
- **Configuration**: Delay 150ms, Tolerance 5px.