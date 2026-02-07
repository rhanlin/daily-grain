# Data Model: Task UI Refinement

## Overview
This feature introduces persistent ordering for categories and defaults for matrix filtering.

## Database Schema (v3)

### Categories Table
Added `orderIndex` for stable sorting.

| Field | Type | Description |
|-------|------|-------------|
| `orderIndex` | number | Sort position (ascending). |

## UI State Models

### Matrix Filter State
Initial state for `MatrixPage`.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `level` | `'TASK' \| 'SUBTASK'` | `'TASK'` | **New default.** |

## Sorting Logic
When categories are reordered via DnD:
1. `arrayMove` is applied to the local category array.
2. `repository.categories.updateOrder(ids)` is called.
3. IndexedDB is updated with new `orderIndex` values for each category.
