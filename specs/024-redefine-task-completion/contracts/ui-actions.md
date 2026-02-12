# UI Action Contracts

## 1. Task Actions

### Update Task Status
- **Action**: User toggles Task completion checkbox.
- **Logic**:
  - `status`: 'TODO' <-> 'DONE'.
  - `updatedAt`: Now.
  - `completedAt`: Now (if DONE) / Undefined (if TODO).
  - **Side Effect**: Update `one-time` subtasks ONLY.

### Update SubTask Definition
- **Action**: User toggles SubTask completion checkbox (in Task Management).
- **Logic**:
  - `isCompleted`: true <-> false.
  - `updatedAt`: Now.
  - **Side Effect**: Trigger Task status re-evaluation immediately.

## 2. Daily Plan Actions

### Toggle Item Completion
- **Action**: User checks Daily Plan item.
- **Logic**:
  - `isCompleted`: true <-> false.
  - **Side Effect**: 
    - `one-time`: Sync definition `isCompleted`.
    - `multi-time`: Update virtual `completedCount`, re-evaluate definition `isCompleted`.
    - `daily`: Update instance `isCompleted`.
    - **Global**: Trigger Task status re-evaluation.
