# Feature Specification: Task UI Refinement

**Feature Branch**: `017-task-ui-refinement`  
**Created**: 2026-02-06  
**Status**: Draft  
**Input**: User description: "新的需求調整如下： 1. 艾森豪視圖頁面預設\"僅顯示Task\"層級的內容; 2. 任務管理頁面 UI 更新：Category 採用正方形卡牌並且雙欄呈現，添加DnD調整排序功能;"

## User Scenarios & Testing *(mandatory)*

### Clarifications
#### Session 2026-02-06
- Q: 手機版拖曳時頁面位移且排序失效？ → A: 現象 B (微小位移感)，代表瀏覽器原生觸控行為干擾 dnd-kit 座標計算。
- Q: 解決衝突的互動方案？ → A: 一致化設定：將手機端 TouchSensor 觸發延遲縮短至 150ms，並在拖曳期間透過 CSS (`touch-action: none`) 禁用全頁捲動與下拉更新。

### User Story 1 - 艾森豪視圖預設層級 (Eisenhower View Default Level) (Priority: P1)

當使用者進入「艾森豪矩陣」頁面時，系統應預設僅顯示「任務 (Task)」層級的內容，而非包含子任務 (Subtask) 的展開視圖。這有助於使用者先從大方向檢視各象限的負載情況。

**Why this priority**: 這是使用者明確要求的第一項調整，直接影響進入該頁面的第一印象。

**Independent Test**: 開啟艾森豪矩陣頁面，驗證列表是否預設只顯示任務名稱，且不顯示子任務內容。

**Acceptance Scenarios**:

1. **Given** 使用者導航至艾森豪矩陣頁面, **When** 頁面加載完成時, **Then** 每個象限的列表應僅呈現任務項 (Tasks)，不自動展開子任務。

---


### User Story 2 - 任務管理頁面 UI 佈局更新 (Task Management UI Update) (Priority: P1)

使用者在「任務管理」頁面中，希望分類 (Category) 以「正方形卡牌」的形式呈現，並且在手機端採用「雙欄 (Two-column)」佈局，以提升空間利用率與視覺美感。

**Why this priority**: 提升核心管理介面的現代感與使用體驗。

**Independent Test**: 在手機版開啟任務管理頁面，驗證分類卡牌是否為正方形且並排顯示（雙欄）。

**Acceptance Scenarios**:

1. **Given** 處於任務管理頁面, **When** 檢視分類列表時, **Then** 分類應以正方形卡牌呈現。
2. **Given** 手機端螢幕尺寸, **When** 檢視分類列表時, **Then** 應呈現雙欄 (Two-column) 佈局。

---


### User Story 3 - 分類排序調整 (Reorder Categories via DnD) (Priority: P2)

使用者希望能自由調整「任務管理」頁面中各分類的顯示順序。透過拖放 (Drag and Drop) 任意分類卡牌，可以即時調整其排序，且該排序應被系統記憶。

**Why this priority**: 提供使用者個人化組織任務的靈活性。

**Independent Test**: 在任務管理頁面拖曳分類卡牌，將其拖拽至新位置，重新整理頁面後驗證順序是否維持。

**Acceptance Scenarios**:

1. **Given** 任務管理頁面有多個分類, **When** 執行拖拽動作交換位置時, **Then** 列表應即時反映新的順序。
2. **Given** 調整完順序後, **When** 重新載入頁面或切換回此頁面時, **Then** 應呈現最後一次調整後的順序。

---


### Edge Cases

- **單一分類**: 當只有一個分類時，應禁用或不觸發 DnD 功能。
- **拖拽衝突**: 需確保分類的 DnD 與卡牌內的點擊行為（如進入分類詳情）不產生衝突（例如透過 Grip Handle 或長按判定）。
- **資料持久化**: 在離線或網路不穩的情況下，調整順序應有適當的存檔機制或錯誤提示。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **艾森豪預設過濾**: 艾森豪矩陣頁面的資料查詢邏輯應預設為 `level = TASK`。系統必須保留現有的 FAB 過濾選單功能，允許使用者視需要切換回顯示子任務 (Subtasks) 的視圖。
- **FR-002**: **正方形卡牌設計**: 使用 CSS (如 Tailwind 的 `aspect-square`) 確保分類卡牌在不同寬度下維持 1:1 比例。
- **FR-003**: **雙欄回應式佈局**: 在小型螢幕 (Mobile) 下，分類列表容器必須使用 `grid-cols-2` 佈局。
- **FR-004**: **分類排序支援**: `Category` 實體應新增 `orderIndex` 欄位（若尚未具備）以記錄顯示順序。
- **FR-005**: **DnD 互動整合**: 在任務管理頁面整合 DnD Kit，實現卡牌間的排序交換邏輯。手機端 TouchSensor 必須設定 150ms 延遲與 5px 容差，且拖曳中的卡牌需套用 `touch-action: none` 以阻止瀏覽器原生捲動干擾。

### Key Entities

- **Category**: 需具備 `orderIndex` (屬性) 用於記錄排序位置。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 進入艾森豪視圖時，首屏呈現的項目 100% 符合任務層級過濾。
- **SC-002**: 在常見手機解析度下，分類管理頁面 100% 呈現雙欄排列。
- **SC-003**: 使用者完成一次分類排序調整的操作時間小於 2 秒。
- **SC-004**: 排序調整後的資料持久化成功率達 100%。