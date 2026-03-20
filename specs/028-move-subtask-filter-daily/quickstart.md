# Quickstart: Daily Plan Gestures & Filters

## Setup for Testing
1. Add at least 3 tasks to today's plan.
2. Ensure one task is a "Daily" recurring task.

## Verification Steps

### SC-001: Discoverable Date Shifting
1. Start dragging a task.
2. **Verify**: Semi-transparent panels appear on the left and right edges.
3. Drag the task into the "Next Day" edge panel.
4. Hover for 500ms.
5. **Verify**: The UI shifts to the next day.
6. Drop the task.
7. **Verify**: The task is now scheduled for the next day.

### SC-002: Filter and Reorder Consistency
1. Enable the "Hide Daily Tasks" filter.
2. **Verify**: Daily tasks disappear.
3. Reorder two visible tasks.
4. Disable the filter.
5. **Verify**: All tasks are visible, and the custom order of the non-daily tasks is preserved.

### SC-003: Performance and Haptics
1. Toggle filters rapidly.
2. **Verify**: UI updates within 100ms.
3. Perform a cross-date shift.
4. **Verify**: Device vibrates when the date changes.
