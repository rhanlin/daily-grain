# Data Model: Fix Swipe Conflict with Overlays

## Overview
This fix involves transient UI state updates. No persistent data changes are required.

## UI State Models

### useSwipe Hook Options
Updated to support disabling.

| Field | Type | Description |
|-------|------|-------------|
| `disabled` | boolean | If true, all touch events are ignored. |

### DailyPlanView Derived State
Calculated from existing states.

| Field | Type | Description |
|-------|------|-------------|
| `isOverlayOpen` | boolean | `isEditing \|\| !!actionItem`. |
