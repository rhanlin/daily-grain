# Feature Specification: Daily Plan Quick Add (每日計劃快捷新增)

**Feature Branch**: `027-daily-plan-quick-add`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: User description: "需要在"每日計劃"頁面裡就能直接新增小任務放進該日的計劃中，而不是每次都一定要去"任務管理"頁面新增。請研究此功能該如何添加以及確保 edge case 的穩定度"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 快捷新增單一子任務 (Priority: P1)

使用者在瀏覽或編輯「每日計劃」時，可以直接點擊新增按鈕，輸入子任務名稱後，該子任務會自動關聯到預設任務並加入當日的計劃列表中。

**Why this priority**: 這是使用者的核心需求，旨在減少頁面切換的摩擦力，提升規劃效率。

**Independent Test**: 使用者在每日計劃頁面點擊新增按鈕，輸入「買牛奶」，點擊確認後，列表立即出現「買牛奶」且標記為今日計畫項目。

**Acceptance Scenarios**:

1. **Given** 使用者位於每日計劃頁面，**When** 點擊列表下方的「快速新增」按鈕並輸入標題，**Then** 子任務被成功創建並顯示在今日清單中。
2. **Given** 使用者新增子任務時未指定分類，**When** 儲存時，**Then** 系統應自動關聯至「預設」或「最近使用」的任務中。

---

### User Story 2 - 選擇所屬分類與任務 (Priority: P2)

使用者在快捷新增時，可以選擇該子任務所屬的分類（Category）與主任務（Task），確保資料結構的正確性。

**Why this priority**: 使用者可能有多個不同領域的任務（如工作、生活），提供選擇能避免資料混亂。

**Independent Test**: 使用者在快捷新增介面可以切換分類，並從該分類的任務清單中選擇一個作為父任務。

**Acceptance Scenarios**:

1. **Given** 快捷新增彈窗已開啟，**When** 使用者選擇「工作」分類，**Then** 下方的任務選單應過濾顯示「工作」分類下的所有主任務。

---

### User Story 3 - 連續新增模式 (Priority: P3)

使用者可以開啟連續新增模式，在按下 Enter 或確認後，輸入框不會關閉，方便快速拆解多個小任務。

**Why this priority**: 規劃當天流程時通常會一次新增多個項目，減少重覆點擊按鈕的次數。

**Independent Test**: 開啟連續模式後，新增完第一個子任務，輸入框自動清空並維持聚焦狀態。

**Acceptance Scenarios**:

1. **Given** 處於連續新增模式，**When** 儲存一個子任務，**Then** 輸入框清空但維持開啟狀態，允許立即輸入下一個。

### Edge Cases

- **無可用分類/任務**: 若系統中完全沒有分類或主任務，應引導使用者先建立一個基礎分類與任務，而非直接報錯。
- **輸入空白標題**: 點擊儲存但標題為空時，應給予視覺提示並禁止提交。
- **重複新增**: 若當日計畫已存在相同名稱的子任務，應提示使用者是否重複，或允許重疊。
- **網路/離線狀態**: 在 IndexedDB 寫入失敗時（如容量滿了），應有錯誤處理機制。

## Clarifications
### Session 2026-03-19
- Q: 如何整合手機版重疊的 FAB？ → A: A (Speed Dial 模式)
- Q: Speed Dial 採用哪種視覺呈現方式？ → A: A (交錯標籤堆疊 Staggered Labels with Backdrop Blur)
- Q: 桌機版快捷新增入口位置？ → A: A (Backlog 邊欄頂部固定輸入框)
- Q: 圖示選用優化？ → A: A (快捷新增: PenLine, 待辦挑選: Inbox)

## Functional Requirements

- **FR-001**: 系統必須提供統一的新增入口。手機版採用整合式 Speed Dial 按鈕，點擊後以交錯動畫彈出「從待辦選擇」與「快捷新增」選項；桌機版將快捷新增入口固定於 Backlog 邊欄頂部。
- **FR-002**: 系統必須支持在不離開當前頁面的情況下輸入子任務標題。
- **FR-003**: 系統必須自動將新建立的子任務加入到當前選擇的日期計畫中 (`dailyPlanItems`)。
- **FR-004**: 系統必須允許使用者選擇已存在的分類與任務作為父節點。
- **FR-005**: 系統必須提供一個「快速建立預設任務」的邏輯，在無任何任務時自動建立名稱為「一般」的分類與「日常任務」主任務。

### Key Entities *(include if feature involves data)*

- **DailyPlanItem**: 紀錄子任務與特定日期的排程關係。
- **SubTask**: 實際儲存任務內容（標題、狀態、所屬 TaskId）。
- **Task/Category**: 提供子任務的歸屬結構。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 使用者在每日計劃頁面新增子任務的點擊次數應減少 60%（相較於前往任務管理頁面）。
- **SC-002**: 從點擊按鈕到新增完成的時間應控制在 5 秒內。
- **SC-003**: 100% 的新增操作應於 100ms 內反應在 UI 列表中，無需手動重新整理。
- **SC-004**: 錯誤的輸入（如空標題）應能被 100% 攔截並給予提示。
