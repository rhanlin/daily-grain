# Feature Specification: Task/Sub-task Cleanup Sync

**Feature Branch**: `020-fix-cleanup-subtasks`  
**Created**: 2026-02-11  
**Status**: Draft  
**Input**: User description: "目前測試發現當我將 Task 移除/封存後，裡面如有為完成的 sub-task，仍會出現在每日計劃的 Backlog Drawer 裡，這是個 bug，如果刪除/封存了 Task，該 Task 內所有的 sub-task 都應該一起被刪除;"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic Sub-task Cleanup on Task Deletion (Priority: P1)

As a user, when I delete a Task that contains multiple sub-tasks, I expect all those sub-tasks to be permanently removed as well, so that my database stays clean and I don't see orphaned sub-tasks in other views.

**Why this priority**: Critical for data integrity and preventing "ghost" tasks from appearing in the UI.

**Independent Test**: Create a Task with 3 sub-tasks, delete the Task, and verify that the sub-tasks are no longer visible in any list and are removed from storage.

**Acceptance Scenarios**:

1. **Given** a Task exists with 3 sub-tasks, **When** the user deletes the Task, **Then** all 3 sub-tasks must also be deleted from the system.
2. **Given** a Task was deleted, **When** I open the Backlog Drawer, **Then** none of its previously associated sub-tasks should be visible.

---

### User Story 2 - Sub-task Removal on Task Archival (Priority: P2)

As a user, when I archive a Task, I expect its sub-tasks to no longer appear in my active Backlog or Daily Plan views, mirroring the "deleted" behavior requested to ensure they don't clutter the active workspace.

**Why this priority**: Essential for keeping the Backlog Drawer relevant and uncluttered.

**Independent Test**: Archive a Task with sub-tasks and verify those sub-tasks disappear from the Backlog Drawer.

**Acceptance Scenarios**:

1. **Given** a Task exists in the Backlog with sub-tasks, **When** the user archives the Task, **Then** the sub-tasks must be removed from the Backlog Drawer view.
2. **Given** an archived Task, **When** checking active task lists, **Then** its sub-tasks should not be counted or displayed as active items.

---

### Edge Cases

- **Partially completed sub-tasks**: If a Task has some completed and some uncompleted sub-tasks, all should be handled (deleted/archived) consistently when the parent Task is removed.
- **Sub-tasks already scheduled in Daily Plan**: If a sub-task belonging to a Task being deleted is already scheduled for today, it should also be removed from the Daily Plan to prevent broken references.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST perform a cascading delete of all sub-tasks when a parent Task is deleted.
- **FR-002**: System MUST ensure sub-tasks of archived Tasks are hidden from the Backlog Drawer and other active planning views.
- **FR-003**: System MUST remove any scheduled entries in the Daily Plan that reference a sub-task being deleted.
- **FR-004**: System MUST maintain data consistency in IndexedDB (Dexie) so that no orphaned sub-tasks exist without a valid parent Task.

### Key Entities

- **Task**: The parent entity representing a goal or project.
- **Sub-task**: A child entity linked to a specific Task. It cannot exist independently in the Backlog Drawer if its parent is gone.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of orphaned sub-tasks (sub-tasks whose parent Task was deleted/archived) are removed from the Backlog Drawer.
- **SC-002**: Database queries for sub-tasks of a deleted Task return zero results immediately after deletion.
- **SC-003**: No "ghost" sub-tasks appear in the Daily Plan after their parent Task has been removed.