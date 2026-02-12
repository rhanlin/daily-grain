# UI Action Contracts: Task Status Redefinition

## Task Actions

### `repository.tasks.update(id, updates)`
- **Updated Logic**:
    - If `updates.status === 'DONE'`:
        - Apply manual sync rule: Mark all `one-time` subtasks as `isCompleted = true`.
        - Do NOT prevent completion if `multi-time` or `daily` items exist (Manual Override).
    - If `updates.status === 'TODO'`:
        - Revert status but preserve subtask progress history.

## SubTask Actions (Triggering Status Engine)

### `repository.subtasks.syncParentTaskStatus(taskId)`
- **Redefined Engine Logic**:
    ```typescript
    const subs = await getSubTasksByTask(taskId);
    const hasDaily = subs.some(s => s.type === 'daily');
    
    const allDone = subs.every(s => {
        if (s.type === 'multi-time') {
            return s.completedCount >= (s.repeatLimit || 1);
        }
        return s.isCompleted;
    });

    if (!hasDaily && allDone) {
        await updateTask(taskId, { status: 'DONE' });
    } else {
        await updateTask(taskId, { status: 'TODO' });
    }
    ```
