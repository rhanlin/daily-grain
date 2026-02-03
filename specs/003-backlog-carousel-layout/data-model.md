# Data Model: Backlog Carousel & Scrolling Layout

**Feature**: 003-backlog-carousel-layout

## Entities

### BacklogGroup (Presentation Entity)
A grouping of tasks by category for display in the carousel or list.

| Field | Type | Description |
|-------|------|-------------|
| `category` | Category | The parent category object |
| `tasks` | Task[] | List of unscheduled tasks in this category |

## Logic & Constraints

### Grouping Logic
1.  **Fetch**: Get all `Category` and all `Task` where `status === 'TODO'`.
2.  **Filter**: Exclude tasks already in the current `DailyPlanItem` list.
3.  **Group**: Map categories to their corresponding tasks.
4.  **Sort**: Categories by `name`, tasks by `eisenhower` (Q1->Q4).

## API / Hook Contract

### `useBacklog`
Returns the grouped data and loading state.

```typescript
function useBacklog(viewDate: string): {
  groups: BacklogGroup[];
  loading: boolean;
}
```