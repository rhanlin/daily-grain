# Data Model: Daily Plan Drag Optimization

## Overview
This feature is focused on UI interaction logic and sensor configuration. It does not introduce new persistent entities in IndexedDB but refines the handling of existing `DailyPlanItem` records.

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

## Persistence
Existing `dailyPlanItems` table in `src/lib/db.ts` remains unchanged.
- `orderIndex` will be updated upon `onDragEnd` success.
