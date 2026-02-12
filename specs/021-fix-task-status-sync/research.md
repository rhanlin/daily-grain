# Research: Task Completion Status Sync Bug & Logic Refinement

**Status**: Complete
**Date**: 2026-02-12

## Problem Analysis

The reported bug is that when a new incomplete subtask is added to a parent task that is already marked as "DONE", the parent task remains in the "DONE" status. Additionally, the specification has been clarified to ensure that the parent task's status must strictly follow the completion state of its subtasks.

### Investigation Findings

1.  **Code Analysis - `src/lib/repository.ts`**:
    - The `repository.subtasks.update` method contains logic to automatically toggle the parent task's status.
    - The `repository.subtasks.create` method lacks this logic.
    - Terminology in the codebase is mixed between "TODO/DONE" and "Incomplete/Completed", but the database uses `'TODO' | 'DONE' | 'ARCHIVED'`.

### Root Cause

The logic for "Sync Parent Status" is only implemented in the `update` operation of subtasks and is missing from the `create` operation.

## Proposed Solution

### Decision 1: Centralize Sync Logic in Repository

We will move the parent status synchronization logic into a dedicated internal function within `repository.subtasks` and call it from `create`, `update`, and `delete`.

**Rationale**: Ensures consistency and removes duplication.

### Decision 2: Enforce Strict Rollup (No Manual Override)

As per clarification, the system will prevent a Task from being set to "DONE" if any subtask is incomplete.

**Rationale**: Maintaining data integrity and a predictable user experience.

### Decision 3: Standardize Terminology to TODO/DONE

We will use TODO/DONE across all new documentation and code to match the database schema.

**Rationale**: Reduces cognitive load and potential for implementation errors.

## Implementation Details

-   Create a helper `syncParentTaskStatus(taskId: string)` in `repository.subtasks`.
-   Update `repository.subtasks.create`, `update`, and `delete` to call this helper.
-   Update `repository.tasks.update` to include a check against subtask status if attempting to set a task to "DONE" (FR-006).
-   Clean up redundant logic in `useSubTask.ts`.
