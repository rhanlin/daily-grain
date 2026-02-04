# Feature Specification: Refine Backlog Filtering

**Feature Branch**: `008-refine-backlog-filtering`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "在每日計劃頁面裡 Backlog 裡應只有 Sub Task 可以被添加到日計劃項目裡，Task 不行；同時如果 Task 內的 Sub Task 已經全數添加到當日計劃中，該 Task 可以在 Backlog 中被隱藏"

## Clarifications

### Session 2026-02-03
- Q: 無子任務之 Task 的排程處理 → A: **隱藏該 Task**。Backlog 不應顯示無子任務的 Task，直到使用者為其建立至少一個子任務為止，以徹底執行細粒度管理原則。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 僅子任務可排程 (Subtask-Only Scheduling) (Priority: P1)

使用者在「每日計畫」頁面的 Backlog 區域時，只能將具體的「子任務 (SubTask)」拖曳或點擊加入到當日的計畫中。父層的「任務 (Task)」標題應僅作為分類與組織的視覺容器，不應具備可拖曳或可加入計畫的功能。

**Why this priority**: 確保計畫項目的粒度一致性，避免使用者誤將整組任務（包含其下所有未完成子任務）直接塞入單日計畫，導致計畫過於龐大。

**Independent Test**: 驗證 Backlog 中的父層 Task 標題無法被拖曳，且點擊（在移動端）不會觸發加入計畫的動作。

**Acceptance Scenarios**:

1. **Given** 使用者在 Backlog 看到一個包含子任務的 Task, **When** 嘗試拖曳該 Task 標題, **Then** 標題應保持不動，且無拖曳視覺回饋。
2. **Given** 使用者在移動端點擊 Task 標題, **When** 執行點擊動作, **Then** 不應彈出加入計畫的確認或執行加入動作。

---

### User Story 2 - 自動隱藏已排程任務 (Auto-Hide Fully Scheduled Tasks) (Priority: P1)

當一個父層任務 (Task) 下屬的所有「TODO」狀態子任務都已經被排入計畫（不限日期）時，該 Task 標題應從 Backlog 的待辦清單中隱藏。只要該 Task 下還有至少一個子任務尚未被排程，該 Task 標題就應繼續顯示。

**Why this priority**: 減少 Backlog 的視覺噪音，讓使用者專注於尚未安排的剩餘工作。

**Independent Test**: 將一個任務下的所有子任務都加入今日或未來的計畫中，驗證該父層任務標題立即從 Backlog 中消失。

**Acceptance Scenarios**:

1. **Given** 任務 A 有兩個子任務 S1, S2, **When** S1 與 S2 都被加入計畫後, **Then** 任務 A 標題應從 Backlog 消失。
2. **Given** 任務 A 有子任務 S1, S2，且只有 S1 被加入計畫, **When** 查看 Backlog, **Then** 任務 A 標題應繼續顯示，並僅列出 S2。

---

### Edge Cases

- **無子任務的任務**: 系統將隱藏無子任務的任務，確保使用者僅能在 Backlog 看到具備具體執行項 (SubTask) 的容器。
- **子任務全數完成**: 若子任務已完成 (DONE) 但未曾排程過，該任務是否應隱藏？（應隱藏，因為無剩餘工作）。
- **取消排程**: 當子任務從日計畫中移除後，若該父層任務原本處於隱藏狀態，應立即重新出現在 Backlog 中。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **停用父層任務排程**: 系統必須禁止 Backlog 中的父層 Task 標題被拖曳 (`draggable: false`) 或透過點擊加入計畫。
- **FR-002**: **啟用子任務排程**: 系統必須維持子任務 (SubTask) 在 Backlog 中的拖曳與加入計畫功能。
- **FR-003**: **動態隱藏邏輯**: Backlog 的資料擷取邏輯必須檢查每個 Task。若該 Task 的所有子任務皆滿足「已排程」或「已完成」任一條件，該 Task 不得顯示於 Backlog。
- **FR-004**: **容器存續條件**: 只要 Task 下仍有至少一個子任務處於「TODO」狀態且「未排程」，該 Task 標題及其剩餘子任務必須顯示。

### Key Entities

- **Task**: 任務容器，用於組織子任務。
- **SubTask**: 具體可執行的工作單元，唯一的計畫對象。
- **DailyPlanItem**: 連結日期與任務/子任務的排程紀錄。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Backlog 中 100% 的父層任務標題均為非交互狀態（無法拖曳/加入）。
- **SC-002**: 確保 Backlog 中 100% 的空容器（無子任務的 Task）會被自動隱藏，消除任何無效的視覺佔位。
- **SC-003**: 使用者在 Daily Plan Page 的操作流程專注於子任務，符合細粒度管理目標。