# Quickstart: Verifying Eisenhower Defaults

## Prerequisites
- Web browser with IndexedDB support.
- Local development server running.

## Verification Steps

### 1. Task Default
1. Open the "Quick Create Task" drawer.
2. Enter a title and click "Create".
3. **Verify**: The new task has a **Q4** badge.

### 2. SubTask Inheritance (Scenario 1)
1. Create a task and set its quadrant to **Q2**.
2. Add a subtask to this task.
3. **Verify**: The subtask automatically has a **Q2** badge.

### 3. SubTask Inheritance (Scenario 2)
1. Create a task and set its quadrant to **Q1**.
2. Add a subtask to this task.
3. **Verify**: The subtask automatically has a **Q1** badge.

### 4. Regression Test
1. Add multiple subtasks to a **Q3** task.
2. **Verify**: All subtasks are **Q3**.
