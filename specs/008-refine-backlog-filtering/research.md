# Research: Refine Backlog Filtering

## Decision: Disabling Drag for Task Headers
- **Decision**: Use the `disabled: true` property in the `useDraggable` hook for Task-level items in the Backlog.
- **Rationale**: This is the standard `dnd-kit` pattern for conditional interactivity. It ensures the item remains visible as a container but cannot be picked up or dropped into the Daily Plan.
- **Alternatives considered**: Removing the `DraggableItem` wrapper entirely for Tasks (rejected to maintain consistent styling and layout structure).

## Decision: Dynamic Hiding Logic in `useBacklog`
- **Decision**: Centralize the hiding logic within the reactive `useBacklog` hook instead of filtering in the UI component.
- **Rationale**: Improves performance by reducing the number of DOM nodes generated and ensures the "Count" indicators (if any) are accurate.
- **Implementation**: After filtering subtasks by status and plan presence, any Task that results in an empty `subtasks` array will be omitted from the final returned `BacklogGroup[]`.

## Decision: Global Plan Visibility
- **Decision**: The "Scheduled" check for hiding tasks should be globally aware (across all dates).
- **Rationale**: If a subtask is scheduled for tomorrow, it shouldn't appear in today's backlog. This enforces the rule that an item can only exist in one plan at a time.
