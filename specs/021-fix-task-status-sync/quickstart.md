# Quickstart: Task Status Sync Fix

## Development Setup

1.  **Branch**: `021-fix-task-status-sync`
2.  **Key Files**:
    - `src/lib/repository.ts`: Central database logic (TODO/DONE sync).
    - `src/hooks/useSubTask.ts`: Hook providing subtask actions.
3.  **Tests**:
    - `src/lib/__tests__/repository.test.ts`
    - `src/hooks/__tests__/useSubTask.test.ts`

## Verification Steps

1.  Run existing tests to ensure no regressions: `npm test`
2.  Manual Test Case 1 (The Bug):
    - Create a Task.
    - Add a Subtask and mark it as done (Parent Task should be DONE).
    - Add a new Subtask (Parent Task should transition to TODO).
3.  Manual Test Case 2 (Strict Enforcement):
    - Create a Task with one incomplete Subtask.
    - Try to manually mark the Task as DONE.
    - Verify the Task remains or reverts to TODO.
