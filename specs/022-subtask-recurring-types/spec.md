# Feature Specification: SubTask Types and Recurring Logic

**Feature Branch**: `022-subtask-recurring-types`  
**Created**: 2026-02-12  
**Status**: Draft  
**Input**: User description: "新增一項功能，在新增 SubTask 時，需要多一個選項可以設定該 SubTask 是否為 '一次性任務', '多次性任務', '每日任務' 三種形式; 1. 預設為 '一次性任務'； 2. 如果選擇 '多次性任務'，表示該子任務可以"重複"新增到不同的日期的每日任務並根據設定有使用次數的限制，且 item 會顯示 progress 之類的進度標註，也包含在 Backlog Drawer 裡的 item 也要有 progress 標記顯示，可以簡單顯示例如：'2/3'; 3. 如果選擇 '每日任務'，表示該子任務可以重複新增到每日任務並沒有次數限制，如同 '多次性任務' 一樣 item 需要有專屬標註記號"

## Clarifications

### Session 2026-02-12
- Q: 品質標準與測試維護 (Quality Standards & Test Integrity) → A: 嚴格 DoD：功能實作必須同時修正所有受影響的測試檔案，並確保 `npm run build` 通過。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create SubTask with Type Selection (Priority: P1)

As a user, when I create a new SubTask, I can choose between "One-time", "Multi-time", or "Daily" types so that I can manage different kinds of responsibilities.

**Why this priority**: Fundamental requirement for the feature. Without type selection, other recurring logic cannot function.

**Independent Test**: Can be fully tested by opening the Add SubTask form and verifying the presence of type selection options.

**Acceptance Scenarios**:

1. **Given** the Add SubTask form, **When** it is opened, **Then** "One-time" MUST be selected by default.
2. **Given** a SubTask being created, **When** I select "Multi-time", **Then** the system MUST allow me to specify a target total count.
3. **Given** a SubTask being created, **When** I select "Daily", **Then** the system MUST mark it as a recurring daily task.

---

### User Story 2 - Track Progress for Multi-time SubTasks (Priority: P2)

As a user, I want to see the completion progress of my multi-time tasks in the Daily Plan and Backlog so that I know how many more times I need to perform the task.

**Why this priority**: Key functional value of the "Multi-time" task type.

**Independent Test**: Add a multi-time task to the daily plan multiple times, mark some as done, and verify the progress indicator (e.g., "1/3") updates correctly in both the Daily Plan and Backlog Drawer.

**Acceptance Scenarios**:

1. **Given** a Multi-time SubTask with a limit of 3, **When** I add it to the Daily Plan twice and mark one as completed, **Then** the progress indicator MUST show "1/3" on both the Daily Plan item and the Backlog Drawer item.
2. **Given** a Multi-time SubTask, **When** the completed count equals the total count, **Then** the progress indicator MUST reflect completion (e.g., "3/3").

---

### User Story 3 - Identify Daily Tasks (Priority: P3)

As a user, I want to see a clear visual indicator for my daily tasks in the Daily Plan and Backlog so that I can distinguish them from one-time tasks.

**Why this priority**: Improves visual clarity and UX for recurring tasks.

**Independent Test**: Create a daily task and verify that a specific mark/icon appears next to its title in the Backlog Drawer and Daily Plan.

**Acceptance Scenarios**:

1. **Given** a Daily SubTask, **When** it is displayed in the Backlog Drawer or Daily Plan, **Then** it MUST have a specific recurring task indicator.

---

### Edge Cases

- **Changing Type**: What happens if a user changes a "Multi-time" task with progress (e.g., 2/3) back to "One-time"? (Assumed: It becomes a normal task; completion status depends on current progress).
- **Exceeding Limit**: The system allows adding more instances than the limit; the indicator will continue to increment and show a visual alert (e.g., 4/3 in red).
- **Deletion**: Deleting a completed instance of a recurring task should decrement the progress numerator.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow users to select a SubTask type (One-time, Multi-time, Daily) during creation and editing.
- **FR-002**: "One-time" MUST be the default selection for new SubTasks.
- **FR-003**: For "Multi-time" tasks, the system MUST provide a numeric input field in the creation and edit dialogs to set the maximum completion limit.
- **FR-004**: The system MUST track the number of times a specific SubTask ID has been marked as "Completed" across all Daily Plan entries.
- **FR-005**: For "Multi-time" tasks, the UI MUST display progress in the format `current/total` (e.g., `2/3`) in both the Backlog Drawer and the Daily Plan view.
- **FR-006**: For "Daily" tasks, the UI MUST display an Infinity icon (∞) to distinguish them from other types.
- **FR-007**: Daily tasks MUST NOT have a completion limit.
- **FR-008**: When a SubTask from a "Daily" or "Multi-time" type is added to the Daily Plan, it creates a new instance linked to the original SubTask definition.
- **FR-009**: When a "Multi-time" task's completion count exceeds its limit (e.g., 4/3), the progress indicator MUST display a visual alert (e.g., red text) to notify the user.

### Key Entities *(include if feature involves data)*

- **SubTask**:
    - `id`: Unique identifier.
    - `type`: Enum (`one-time`, `multi-time`, `daily`).
    - `repeatLimit`: Integer (only relevant for `multi-time`).
- **DailyPlanItem**:
    - `refId`: References the SubTask ID.
    - `isCompleted`: Tracks completion of this specific instance.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully create and categorize SubTasks into three types.
- **SC-002**: Progress for Multi-time tasks is updated in real-time (under 200ms) when an instance is marked as completed.
- **SC-003**: The progress indicator is visible and accurate in both the Backlog Drawer and Daily Plan views.
- **SC-004**: 100% of Daily tasks are clearly distinguishable via their specific mark/icon.
- **SC-005**: 100% of pre-existing and new automated tests pass, and `npm run build` completes without Lint or TypeScript errors.
