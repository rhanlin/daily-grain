# Quickstart: Verifying Task UI Refinement

## Prerequisites
- Mobile browser emulation (DevTools).
- Multiple categories and tasks created.

## Verification Steps

### 1. Eisenhower Default View
1. Navigate to "艾森豪矩陣" (Matrix).
2. **Verify**: The view only shows items at the "Task" level by default.
3. Open FAB filter and select "包含子任務".
4. **Verify**: Subtasks are now visible.

### 2. Category Card Layout
1. Navigate to "任務管理" (formerly Theme Categories).
2. **Verify**: Category cards are square (`aspect-square`).
3. Switch to mobile view.
4. **Verify**: Cards are arranged in a 2-column grid.

### 3. Category Reordering
1. In "任務管理", drag Category A to the position of Category B.
2. **Verify**: Position is updated.
3. Refresh the page.
4. **Verify**: The custom order is preserved.
