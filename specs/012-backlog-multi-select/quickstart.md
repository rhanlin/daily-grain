# Quickstart: Verifying Category-Level Multi-Select

## Prerequisites
- Mobile device or Chrome DevTools (Mobile Mode).
- At least two categories, one with 2+ tasks and several subtasks.

## Verification Steps

### 1. Trigger Multi-select
1. Open the Backlog Drawer.
2. Long-press on any subtask in Category A.
3. **Verify**: Selection mode active. Footer appears.

### 2. Same-Category Selection
1. Tap another subtask under a **different task** but in the **same category A**.
2. **Verify**: Item is selected. Counter in footer increments.

### 3. Slide Locking
1. Slide the carousel to Category B.
2. **Verify**: Category B content is dimmed (gray/opacity).
3. **Verify**: Tapping subtasks in Category B has no effect.

### 4. Batch Execution
1. Select 3 items in Category A.
2. Slide to Category B.
3. Click "Add to Plan (3)" in the footer.
4. **Verify**: Drawer resets. 3 items added to Daily Plan.