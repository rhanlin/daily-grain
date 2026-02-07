# Data Model: Backlog and Rollover Fixes

## Overview
This feature fixes logic in data migration (Rollover) and improves transient UI state handling (Multi-select).

## Persistence Logic (Rollover)

### Rollover Condition
- **Source Date**: `getLocalToday() - 1 day`
- **Target Date**: `getLocalToday()`
- **Eligible Items**: `dailyPlanItems` where `isCompleted === false`.

### Processing Steps
1. Fetch all eligible items for the previous day.
2. For each item:
    - Create a new `dailyPlanItem` for the current date.
    - Set `isRollover: true`.
    - (Optionally) Link to the same `refId` and `refType`.
3. Wrap all operations in a `Dexie` transaction to ensure all N items are moved together.

## UI State Transitions (Multi-select)

### Interaction Rules
| Event | Action | Logic |
|-------|--------|-------|
| `touchstart` | Record start point | `ref.current = { x, y }` |
| `touchend` | Evaluate | If `dist(start, end) < 10px` AND `isSelectionMode`, trigger `onToggleSelection`. |
| `scroll` | Inhibit | If scroll occurs, clear start point to prevent selection. |
