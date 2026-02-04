# Quickstart: Backlog Filtering Verification

## Verification Scenarios

### 1. Drag & Drop Restriction
- Open the Daily Plan page.
- Attempt to drag a **Task Title** from the Backlog to the plan area.
- **Expected**: The title remains static; no drag shadow appears.
- Attempt to drag a **Subtask** from the same category.
- **Expected**: Drag works normally; subtask can be added to the plan.

### 2. Automatic Hiding
- Identify a Task with two subtasks (S1, S2).
- Add S1 to the Daily Plan.
- **Expected**: Task title remains visible; S2 remains in the backlog.
- Add S2 to the Daily Plan (same or different date).
- **Expected**: The entire Task container disappears from the Backlog.

### 3. Archive/Completion Sync
- Complete a subtask in the Task Detail page.
- Return to the Daily Plan.
- **Expected**: If that was the last subtask, the Task header is hidden in the Backlog.
