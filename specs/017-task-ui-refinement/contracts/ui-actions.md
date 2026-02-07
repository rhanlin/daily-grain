# UI Contracts: Task UI Refinement

## Actions

### `onCategoryDragEnd`
- **Component**: `CategoryOverview`.
- **Trigger**: Drop a category card into a new position.
- **Outcome**: Call `repository.categories.updateOrder` and toast success.

### `toggleMatrixLevel`
- **Component**: `MatrixPage`.
- **Trigger**: Select level from FAB filter menu.
- **Outcome**: Switch visibility between Tasks and Subtasks.

## Component Props Update

### `CategoryCard`
- `isDragging: boolean` (Visual feedback).
- `dragHandleProps: any` (Listeners).
- **CSS**: Apply `touch-action: none` to the card container to prevent mobile scroll interference.

## Sensor Configuration (`CategoryOverview`)
- **TouchSensor**: 
  - `delay: 150` (ms)
  - `tolerance: 5` (px)
- **Rationale**: Prevents background displacement (Phenomenon B) and ensures reliable coordinate calculation.