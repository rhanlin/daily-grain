# Data Model: Backlog Synchronization

This fix does not change the schema but refactors the view model transformation in the `useBacklog` hook.

## Entities Involved
- `Category`: Needs to track `name`, `color`, `isArchived`.
- `Task`: Needs to track `title`, `categoryId`, `status`, `eisenhower`.
- `SubTask`: Needs to track `title`, `taskId`, `isCompleted`.
- `DailyPlanItem`: Needs to track `refId`, `date`.

## Refined Grouping Logic
1.  **Fetch Categories**: All where `!isArchived`.
2.  **Fetch Plan Items**: All for the current `date`.
3.  **Fetch Tasks**: All where `status === 'TODO'` and `!planRefIds.has(task.id)`.
4.  **Fetch SubTasks**: All where `!isCompleted` and `!planRefIds.has(subtask.id)`.
5.  **Assemble Groups**:
    - For each Category:
        - Include all backlog tasks.
        - Include all backlog subtasks.
        - **Keep Group** if either task list or subtask list is non-empty.
