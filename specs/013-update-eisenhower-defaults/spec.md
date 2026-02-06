# Feature Specification: Update Eisenhower Defaults

**Feature Branch**: `013-update-eisenhower-defaults`  
**Created**: 2026-02-04  
**Status**: Draft  
**Input**: User description: "關於新增Task, SubTask 時預設的cycleEisenhower 邏輯更新： Task 新增時預設為 Q4, SubTask 新增時預設請根據父層 Task 決定，例如父層 Task 被切換成 Q2, 則在該 Task 內建立 SubTask 時預設就會是 Q2"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 任務預設象限設定 (Default Task Quadrant) (Priority: P1)

當使用者在應用程式中建立一個新的任務 (Task) 時，系統應自動將其艾森豪矩陣象限設定為 Q4 (不重要且不緊急)。這樣使用者可以在稍後再根據實際情況調整優先級。

**Why this priority**: 確保新任務有統一且符合邏輯的初始狀態。

**Independent Test**: 建立一個新任務，並立即檢查其象限屬性，驗證是否為 Q4。

**Acceptance Scenarios**:

1. **Given** 使用者準備新增一個任務, **When** 執行新增動作且未指定象限時, **Then** 系統建立的任務預設象限應為 Q4。

---

### User Story 2 - 子任務繼承象限設定 (SubTask Quadrant Inheritance) (Priority: P1)

當使用者在一個現有任務下建立子任務 (SubTask) 時，子任務的預設象限應與父層任務保持一致。例如，如果父層任務被設定為 Q2，那麼在該任務下建立的所有子任務應自動預設為 Q2。

**Why this priority**: 保持任務與其子任務在優先級上的邏輯一致性，減少手動調整的次數。

**Independent Test**: 在一個被設定為 Q2 的任務下建立子任務，驗證子任務的預設象限是否為 Q2。

**Acceptance Scenarios**:

1. **Given** 存在一個象限為 Q2 的父層任務, **When** 在該任務下建立子任務時, **Then** 子任務的預設象限應為 Q2。
2. **Given** 存在一個象限為 Q1 的父層任務, **When** 在該任務下建立子任務時, **Then** 子任務的預設象限應為 Q1。

---

### Edge Cases

- **父層任務無象限資訊**: 如果因為資料異常導致父層任務無象限資訊，子任務新增時應預設為 Q4。
- **批次匯入子任務**: 透過匯入功能一次新增多個子任務時，所有子任務皆應正確繼承父層任務的象限。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 建立 Task 時，系統必須預設賦予其象限值為 "Q4"。
- **FR-002**: 建立 SubTask 時，系統必須讀取父層 Task 的當前象限值。
- **FR-003**: 建立 SubTask 時，其預設象限值必須與父層 Task 的象限值完全相同。
- **FR-004**: 若父層 Task 象限值不存在或無效，SubTask 預設象限值必須回退 (Fallback) 為 "Q4"。

### Key Entities

- **Task**: 任務實體，包含 `eisenhower` (Q1-Q4) 屬性。
- **SubTask**: 子任務實體，包含 `taskId` (父層 ID) 與 `eisenhower` (Q1-Q4) 屬性。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 新增任務的 Q4 預設達成率為 100%。
- **SC-002**: 子任務繼承父層任務象限的正確率為 100%。
- **SC-003**: 所有新增邏輯變更必須通過單元測試驗證。