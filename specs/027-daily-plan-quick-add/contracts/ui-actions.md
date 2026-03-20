# UI Actions: Daily Plan Quick Add

## Mobile: Speed Dial Interactions

### Action: Toggle Speed Dial
- **Trigger**: Click the FAB (Plus icon).
- **State**: Set `isSpeedDialOpen` to `!isSpeedDialOpen`.
- **UI Feedback**: 
    - Backdrop blur appears.
    - Main FAB rotates 45 degrees (becomes an 'X').
    - "Select from Backlog" and "Quick Add Task" labels/buttons stagger up.

### Action: Select Quick Add
- **Trigger**: Click "Quick Add Task" option.
- **State**: Close Speed Dial, open `QuickAddTaskDrawer`.

### Action: Select from Backlog
- **Trigger**: Click "Select from Backlog" option.
- **State**: Close Speed Dial, open `BacklogDrawer`.

## Desktop: Sidebar Input

### Action: Quick Add from Sidebar
- **Trigger**: Type in the top input field of the Backlog sidebar and press **Enter**.
- **Behavior**: Calls `repository.subtasks.quickCreate` with the current date and most recent task context.

## Logic: Submit Quick Add (Drawer)
- **Validation**: `title` must not be empty.
- **Submit**:
    1. Create SubTask.
    2. Add to DailyPlanItem for `selectedDate`.
    3. If `continuousMode` is true: Reset title, keep Drawer open.
    4. Else: Close Drawer.
- **Feedback**: Toast success message + subtle vibration.
