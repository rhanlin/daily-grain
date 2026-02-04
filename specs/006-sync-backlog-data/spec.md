# Feature Specification: Backlog Data Synchronization Fix

**Feature Branch**: `006-sync-backlog-data`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "在每日計劃頁面裡的 Backlog 任務清單目前似乎沒有跟首頁的分類,Task,SubTask 資料是同步的，這是一個 bug 需要修正"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Backlog 即時同步 (Backlog Real-time Synchronization) (Priority: P1)

當使用者在首頁（或分類詳情頁）修改分類名稱、顏色，或是編輯任務 (Task) 與子任務 (SubTask) 的標題時，切換到「每日計畫」頁面，Backlog 區域應立即顯示更新後的內容，無需重新整理頁面。

**Why this priority**: 確保資料一致性是系統可靠性的基礎，避免使用者因看到過期資訊而感到困惑或造成重複操作。

**Independent Test**: 在首頁修改分類名稱，然後進入每日計畫頁面，驗證 Backlog 中的該分類名稱已同步更新。

**Acceptance Scenarios**:

1. **Given** 使用者在首頁修改了「工作」分類為「公司專案」, **When** 進入每日計畫頁面的 Backlog, **Then** 該分類標題應顯示為「公司專案」。
2. **Given** 使用者在分類詳情頁修改了某個任務的標題, **When** 在每日計畫頁面查看 Backlog, **Then** 該任務的標題應顯示為修改後的內容。
3. **Given** 使用者刪除了一個分類, **When** 進入每日計畫頁面, **Then** 該分類及其下的任務不應出現在 Backlog 中（除非該任務已排程）。

---

### Edge Cases

- **離線狀態下的同步**: 在無網路連線時（若未來支援雲端同步），本地資料庫 (IndexedDB) 仍應保持 UI 與資料的一致。
- **大量資料異動**: 同時更新多個任務或分類時，Backlog 的分組邏輯不應發生崩潰或顯示錯誤。
- **排程中項目的同步**: 若 Backlog 中的項目正被排程進入今日計畫，此時修改資料應確保計畫項目與 Backlog 來源同步。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **響應式資料擷取 (Reactive Data Retrieval)**: Backlog 必須採用響應式查詢機制，確保當底層資料發生變動時，使用者介面能自動更新而無需手動重新整理。
- **FR-002**: **分類層級同步**: Backlog 中的任務分組必須動態對應到最新的 `Category` 實體。
- **FR-003**: **任務與子任務一致性**: 任何對 `Task` 或 `SubTask` 欄位的更新（如 `title`, `eisenhower`）必須在 Backlog 中即時反映。
- **FR-004**: **排除已封存資料**: Backlog 必須確保僅顯示 `status !== 'ARCHIVED'` 且分類未被封存的資料。
- **FR-005**: **輪播邊境黏滯效果 (Sticky Carousel Boundary)**: 系統必須在移動版輪播中實作物理邊界感。若使用者手勢滑入起始佔位符 (Index 0)，系統必須以彈簧動畫自動回撥至首筆有效內容 (Index 1)，並防止停留於空白區域。

### Key Entities

- **Category**: 任務的分類容器。
- **Task**: 待辦任務主體。
- **SubTask**: 任務的子細分項。
- **DailyPlanItem**: 紀錄任務是否已被排程至特定日期的關聯實體。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 資料庫更新後，Backlog UI 的更新延遲應低於 100ms。
- **SC-002**: 確保 100% 的 `Category`, `Task`, `SubTask` 更新都能在 Backlog 檢視中正確呈現（無遺漏更新）。
- **SC-003**: 頁面切換 (Navigation) 過程中不應出現明顯的舊資料閃爍 (Stale data flash)。- **SC-004**: 邊界回彈動畫應具備物理真實感，且在主流手機上運行不應導致影格掉幀 (維持 60fps)。
