# UI Actions: Daily Plan Gestures & Filters

## Action: Toggle Routine Filter
**Trigger**: Toolbar Switch click.
**State**: `hideRoutine: boolean`.
**Behavior**: Filtered re-render of the list.

## Action: Display Side Guide Panels
**Trigger**: `onDragStart` event from `DndContext`.
**Visibility**: Left and Right 15% width, absolute full height.
**Style**: Backdrop-blur + semi-transparent overlay + "前一天 / 隔天" text.

## Action: Gesture Date Shift
**Trigger**: Hover over Side Guide Panel.
**Timer**: 500ms debounce.
**Behavior**:
1. Visual pulse feedback on the panel.
2. Call `setSelectedDate(prev/next)`.
3. Vibrate (Haptic feedback).

## Action: Finalize Cross-Date Move
**Trigger**: `onDragEnd` dropped on a Side Guide Panel.
**Behavior**:
1. Calculate `targetDate`.
2. Update repository with the new date for the specific item.
3. Show Toast: "已移至 [日期]".
