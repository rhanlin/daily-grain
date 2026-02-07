# Quickstart: Verifying Backlog & Rollover Fixes

## Prerequisites
- Browser with Mobile Emulation (DevTools).
- Multiple uncompleted items in yesterday's plan.

## Verification Steps

### 1. Rollover Integrity
1. Add 5 tasks to "Yesterday". Mark 2 as completed, leave 3 uncompleted.
2. Advance system date or reload the app to trigger "Today".
3. **Verify**: Today's plan contains exactly the 3 uncompleted tasks from yesterday.
4. **Verify**: They are all marked with the "Yesterday's Delay" (延宕) label.

### 2. Backlog Occlusion Fix
1. Open Backlog Drawer.
2. Enter Multi-select mode (long press).
3. Scroll to the bottom of the list.
4. **Verify**: The last item is fully visible and clickable above the "Add to Plan" button bar.

### 3. Scroll vs. Selection
1. Enter Multi-select mode.
2. Select 1 item.
3. Rapidly scroll the list by swiping over other items.
4. **Verify**: Only the 1 originally selected item remains selected.
5. **Verify**: No new items were accidentally selected during the scroll gesture.
