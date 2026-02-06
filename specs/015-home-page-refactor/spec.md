# Feature Specification: Home Page Refactor & Terminology Update

**Feature Branch**: `015-home-page-refactor`  
**Created**: 2026-02-06  
**Status**: Draft  
**Input**: User description: "請把此 app 的首頁改成\"每日計劃\"，且在任務清單(Backlog) Drawer 中如果顯示\"無任務項目\"，下方要多一個按鈕點擊後前往\"主題分類\"頁面引導使用者去新增項目。 另外目前的\"主題分類\"命名上我要改成\"任務管理\""

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 變更首頁為每日計畫 (Home Page to Daily Plan) (Priority: P1)

使用者進入應用程式（根路徑 `/`）時，系統應直接呈現「每日計畫」頁面，而非原本的「主題分類」頁面。原本的「主題分類」頁面應移至新的路徑。

**Why this priority**: 讓使用者第一時間看到今日最核心的任務，提升 app 的即時實用價值。

**Independent Test**: 訪問網站根路徑 `http://localhost:5173/`，驗證是否顯示日期標題與當日計畫清單。

**Acceptance Scenarios**:

1. **Given** 應用程式已啟動, **When** 訪問 `/` 路徑, **Then** 呈現 `DailyPlanPage` 的內容。
2. **Given** 導覽列中的「每日計畫」, **When** 點擊後, **Then** 指向 `/`。

---

### User Story 2 - 命名更新為「任務管理」 (Terminology Update to Task Management) (Priority: P1)

全站所有出現「主題分類」文字的地方（包括導覽列、頁面標題、提示文字等），皆應統一改名為「任務管理」。

**Why this priority**: 符合使用者對功能認知的語意修正，讓任務分類的功能更具行動導向。

**Independent Test**: 檢查導覽列（側邊欄或底部導覽列）以及原首頁的標題，驗證文字是否已更新為「任務管理」。

**Acceptance Scenarios**:

1. **Given** 導覽列顯示, **When** 看到原「主題分類」位置, **Then** 顯示文字應為「任務管理」。
2. **Given** 訪問原首頁（現為任務管理頁）, **When** 看到頁面標題或說明, **Then** 顯示文字應為「任務管理」。

---

### User Story 3 - 任務清單空狀態引導 (Backlog Empty State Guidance) (Priority: P2)

當使用者打開「任務清單」(Backlog) Drawer 且系統中完全沒有任何任務項目時，介面應顯示一個顯眼的按鈕，引導使用者前往「任務管理」頁面新增分類與任務。

**Why this priority**: 優化首用體驗 (First-time user experience)，防止使用者在空狀態下感到迷失。

**Independent Test**: 清空資料庫或使用新帳號登入，開啟每日計畫中的 Backlog Drawer，驗證是否出現「前往任務管理」按鈕，並點擊確認跳轉成功。

**Acceptance Scenarios**:

1. **Given** Backlog 內無任何項目, **When** 開啟 Backlog Drawer, **Then** 顯示「無任務項目」文字以及「前往任務管理」按鈕。
2. **Given** 顯示引導按鈕, **When** 點擊按鈕, **Then** Drawer 關閉並自動導航至「任務管理」頁面。

---

### Edge Cases

- **路徑重定向**: 需處理舊有 `/daily-plan` 路徑的重定向或對應更新，確保書籤不會失效。
- **導覽反饋**: 確保跳轉至「任務管理」後，導覽列的高亮狀態（Active Link）正確更新。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **首頁路徑變更**: 將 `App.tsx` 中的路由配置更新，使 `/` 對應至 `DailyPlanPage`。
- **FR-002**: **頁面重命名**: 建立新的路徑（如 `/management`）對應至原 `HomePage` (CategoryOverview)，並將全站顯示名稱改為「任務管理」。
- **FR-003**: **導覽列同步**: 更新 `AppLayout.tsx` 的導覽項目清單，反映名稱變更與路徑調整。
- **FR-004**: **空狀態擴充**: 修改 `BacklogContent.tsx` 的 `groups.length === 0` 邏輯，加入導航按鈕。
- **FR-005**: **自動關閉選單**: 點擊 Backlog 中的引導按鈕後，應主動觸發 Drawer 關閉動作（透過傳遞回呼函式）。

### Key Entities

- **Category**: 被重新定義為「任務管理」的核心單位。
- **Backlog**: 任務清單的空狀態處理。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 根路徑加載成功率 100%，正確顯示每日計畫。
- **SC-002**: 使用者在空狀態下從 Backlog 到達新增分類頁面的點擊次數減少（引導按鈕直達）。
- **SC-003**: 全站文字搜尋 "主題分類" 結果應為 0。