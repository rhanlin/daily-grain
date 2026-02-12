# Feature Specification: Fix Task Completion Status Sync

**Feature Branch**: `021-fix-task-status-sync`  
**Created**: 2026-02-12  
**Status**: Draft  
**Input**: User description: "有個bug需要修正，當 Task 內的所有 sub task 都被標記為完成時，Task 也會自動被標記完成，但是此時在該 Task 內新增一個為完成的 sub task，該Task仍標記為未完成，預期此時Task要重新回到為完成狀態"

## Clarifications

### Session 2026-02-12
- Q: 手動覆蓋行為 (Manual Override Behavior) → A: 強制同步：若有任何未完成子任務，任務必須為 TODO，不允許手動標記為 DONE。
- Q: 術語一致性 (Terminology Consistency) → A: 統一使用 TODO/DONE：規格中所有描述任務狀態的地方均統一使用 TODO 與 DONE。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add incomplete subtask to a DONE task (Priority: P1)

When a task has been automatically marked as DONE because all its existing subtasks are finished, adding a new subtask that is not yet completed should trigger the parent task to return to a "TODO" state.

**Why this priority**: This directly addresses the reported bug and ensures the data integrity of task statuses.

**Independent Test**: Can be fully tested by creating a task, completing all its subtasks, adding a new incomplete subtask, and verifying the parent task's status becomes "TODO".

**Acceptance Scenarios**:

1. **Given** a task where all subtasks are completed (Parent Task status is "DONE"), **When** a new subtask is added with status "Incomplete", **Then** the parent task status MUST automatically change to "TODO".
2. **Given** a task with no subtasks that is marked as "DONE", **When** a new subtask is added with status "Incomplete", **Then** the parent task status MUST automatically change to "TODO".

---

### User Story 2 - Add completed subtask to a DONE task (Priority: P2)

Adding a subtask that is already marked as completed to a task that is already DONE should not change the parent task's status.

**Why this priority**: Ensures that the status synchronization logic doesn't overreact and incorrectly mark tasks as TODO.

**Independent Test**: Add a completed subtask to a DONE task and verify the status remains "DONE".

**Acceptance Scenarios**:

1. **Given** a task where all subtasks are completed (Parent Task status is "DONE"), **When** a new subtask is added with status "Completed", **Then** the parent task status MUST remain "DONE".

---

### Edge Cases

- **Bulk Addition**: If multiple subtasks are added at once (e.g., via import or multi-add), if at least one is "Incomplete", the parent task must become "TODO".
- **Empty Subtask List**: If all subtasks are deleted from a task that was "DONE" via subtask rollup, what should be the parent task's status? (Assumed: It should remain "DONE" or follow manual setting).
- **Subtask Re-activation**: If an existing subtask is moved from another task to a DONE task, the same sync logic should apply.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST monitor the addition of new subtasks to any parent task.
- **FR-002**: Upon adding a subtask, the system MUST evaluate the completion status of all subtasks belonging to that parent task.
- **FR-003**: If the parent task is currently marked as "DONE" but the newly added subtask is "Incomplete", the system MUST update the parent task to "TODO".
- **FR-004**: The status update MUST be atomic and occur immediately after the subtask is successfully persisted.
- **FR-005**: The synchronization logic MUST be applied regardless of the UI entry point (e.g., Task Detail view, Daily Plan view, etc.).
- **FR-006**: The system MUST prevent a Task from being manually set to "DONE" if it contains one or more "Incomplete" subtasks.

### Key Entities *(include if feature involves data)*

- **Task**: Represents a high-level goal. Has a `status` (`'TODO' | 'DONE' | 'ARCHIVED'`).
- **SubTask**: Represents a granular action item within a Task. Has a `status` (Incomplete/Completed) and a reference to a `parentTaskId`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of tasks correctly transition to "TODO" when an incomplete subtask is added to a DONE parent task.
- **SC-002**: Status synchronization occurs with no perceptible lag (under 100ms) for the user.
- **SC-003**: No regressions: Tasks MUST still automatically mark as "DONE" when the last "Incomplete" subtask is marked as completed.
