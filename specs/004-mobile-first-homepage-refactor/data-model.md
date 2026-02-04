# Data Model: Homepage Overview

This feature utilizes the existing `Category`, `Task`, and `SubTask` entities but optimizes the "Overview" retrieval.

## View Model: Category Summary Card
Used on the `HomePage` to provide a snapshot of each category.

| Field | Type | Source |
|-------|------|--------|
| `categoryId` | UUID | `Category.id` |
| `name` | String | `Category.name` |
| `color` | String | `Category.color` |
| `todoCount` | Integer | Count of `Tasks` where `status === 'TODO'` |
| `completedCount` | Integer | Count of `Tasks` where `status === 'DONE'` |

## Navigation State
- **Path**: `/category/:categoryId`
- **Params**: `categoryId` (Used to filter `Task` and `SubTask` collections in the detail view).
