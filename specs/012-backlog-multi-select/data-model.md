# Data Model: Backlog Multi-Select (Category Scope)

## Overview
This feature manages transient UI states for multi-selection within a specific category.

## UI State Models

### MultiSelectState
Transient state held in `BacklogContent`.

| Field | Type | Description |
|-------|------|-------------|
| `isSelectionMode` | boolean | Calculated: `activeCategoryId !== null`. |
| `activeCategoryId` | string \| null | The ID of the Category (Slide) where selection is allowed. |
| `selectedIds` | Set<string> | Collection of SubTask IDs currently selected within the active category. |

## Selection Rules
1. **Trigger**: Long-press on a SubTask -> `activeCategoryId` set to its category ID, ID added to `selectedIds`.
2. **Toggle**: Click on a SubTask in the same category -> add/remove from `selectedIds`.
3. **Lock**: If `isSelectionMode` is true, all other `CategorySlide` instances (where `id !== activeCategoryId`) enter "Locked" state.
4. **Action**: "Add to Plan" button executes batch insertion for all `selectedIds`.