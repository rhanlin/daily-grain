# Data Model: Daily Plan Drag Optimization

## Overview
This feature focuses on UI interaction logic and sensor configuration. It utilizes existing data structures but defines strict rules for their manipulation and state transitions.

## Logical Entities

### Touch Sensor Config
Logic for gesture recognition thresholds.

| Field | Type | Description |
|-------|------|-------------|
| `delay` | number (ms) | Time to hold before drag starts (Recommended: 150). |
| `tolerance` | number (px) | Max movement allowed before drag is cancelled (Recommended: 5). |

### Drag Handle State
Transient state during a drag operation.

| Field | Type | Description |
|-------|------|-------------|
| `activeId` | string | ID of the item currently being dragged. |
| `isOver` | boolean | Whether the dragged item is over a valid drop zone. |
| `disabled` | boolean | If true, handle is hidden and listeners are detached (e.g. during matrix sort). |

## Entities

### Task (Updated in Feature 010)
- **createdAt**: ISO Date String (used for stable sorting).

### DailyPlanItem (Existing)
- **orderIndex**: Number (updated upon `onDragEnd` success).

## State Transitions
1. **Idle**: `sortByMatrix` is false. Drag handles are visible.
2. **Dragging**: User touches handle. `delay` passes. `isDragging` becomes true.
3. **Sorted**: `onDragEnd` triggers. `reorderItems` updates `orderIndex` in IndexedDB.
4. **Locked**: `sortByMatrix` is true. `disabled` prop passed to `DraggableTask`. Handles hidden.