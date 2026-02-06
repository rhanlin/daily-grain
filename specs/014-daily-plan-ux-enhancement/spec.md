# Feature Specification: Daily Plan UX Enhancement

**Feature Branch**: `014-daily-plan-ux-enhancement`  
**Created**: 2026-02-04  
**Status**: Draft  
**Input**: User description: "在 /daily-plan 頁面需要新增兩個功能： 1. 手機版使用者可以用手勢左右滑動螢幕進行切換日期，滑動日期工作項目時要有動畫增添順暢度與優化使用體驗; 2. 在每日的工作項目列表裡，目前可以點擊項目上的 more Icon 展開 Drawer，裡面除了要有\"從今日計劃移除\"之外，需要新增\"編輯標題\"功能"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 手勢切換日期 (Swipe Date Navigation) (Priority: P1)

手機版使用者在「每日計畫」頁面時，可以透過在螢幕中央區域左右滑動手勢來切換日期。向左滑動（手指從右向左）切換至「明天」，向右滑動（手指從左向右）切換至「昨天」。切換時應有流暢的橫向平移動畫，讓使用者直觀感受到日期的前進或後退。

**Why this priority**: 提升手機端單手操作的便利性，符合現代行動應用的直覺互動習慣。

**Independent Test**: 在手機版開啟 /daily-plan，在任務列表區域向左滑動，驗證日期是否變更為明天，且列表有平滑的進入動畫。

**Acceptance Scenarios**:

1. **Given** 使用者位於手機版每日計畫頁面, **When** 在任務列表區域向左滑動, **Then** 頁面日期切換至下一日，且列表以向左平移的動畫呈現。
2. **Given** 使用者位於手機版每日計畫頁面, **When** 在任務列表區域向右滑動, **Then** 頁面日期切換至前一日，且列表以向右平移的動畫呈現。
3. **Given** 正在滑動切換中, **When** 資料尚未載入完成, **Then** 應顯示載入狀態或骨架屏，避免畫面閃爍。

---

### User Story 2 - 編輯計畫項目標題 (Edit Title in Daily Plan) (Priority: P1)

使用者在每日計畫列表中，點擊項目右側的 `MoreHorizontal` 圖示後，展開的 Drawer 選單中除了現有的「從今日計畫移除」外，新增「編輯標題」選項。點擊後可修改該任務（Task）或子任務（SubTask）的名稱，修改後立即更新資料庫並反應在畫面上。

**Why this priority**: 允許使用者在排程時快速修正內容，無需跳轉回 Backlog 或分類頁面，提升操作效率。

**Independent Test**: 點擊計畫項目的更多選單，選擇「編輯標題」，修改名稱並存檔，驗證列表上的名稱是否更新。

**Acceptance Scenarios**:

1. **Given** 計畫項目的選單已開啟, **When** 點擊「編輯標題」, **Then** 彈出編輯視窗（Dialog）或在 Drawer 內顯示輸入框。
2. **Given** 處於編輯狀態, **When** 修改標題並按下確認, **Then** 資料庫對應的 Task/SubTask 名稱更新，且選單自動關閉。
3. **Given** 編輯計畫項目, **When** 標題為空時, **Then** 應防止存檔並給予錯誤提示。

---

### Edge Cases

- **滑動衝突**: 需確保左右滑動手勢不與側邊選單（如果有）或系統導覽手勢（如 iOS 的返回）產生嚴重衝突。
- **類型區分**: 編輯標題時，需根據 `refType`（TASK 或 SUBTASK）正確更新對應的資料表。
- **動畫效能**: 大量任務時，平移動畫需保持 60fps，避免掉影。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **手勢偵測**: 系統必須偵測 `/daily-plan` 任務列表區域的橫向滑動事件。
- **FR-002**: **日期切換邏輯**: 向左滑動觸發 `selectedDate + 1`, 向右滑動觸發 `selectedDate - 1`。
- **FR-003**: **平移過場動畫**: 切換日期時，任務列表應具備橫向平移（Slide）動畫效果（建議使用 Framer Motion）。
- **FR-004**: **選單擴充**: `DailyPlanView` 的操作 Drawer 必須新增「編輯標題」按鈕。
- **FR-005**: **標題更新邏輯**: 點擊編輯後，系統應關閉 Drawer 並彈出獨立的編輯對話框 (Dialog)，在使用者確認後調用 `repository` 更新資料。
- **FR-006**: **表單驗證**: 標題字數不可為 0。

### Key Entities

- **Task**: 包含 `title` 欄位。
- **SubTask**: 包含 `title` 欄位。
- **DailyPlanItem**: 關聯的計畫項，透過 `refId` 與 `refType` 索引至實體。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 日期切換動畫在主流手機瀏覽器（iOS Safari, Android Chrome）的影格率不低於 50fps。
- **SC-002**: 使用者從開啟選單到完成標題編輯的步驟應在 3 次點擊內完成（不含輸入）。
- **SC-003**: 橫向滑動手勢的觸發判定成功率應達到 95% 以上（排除垂直捲動意圖）。