# Feature Specification: Category Management Refactor

**Feature Branch**: `005-category-management-refactor`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "在手機版首頁裡，目前的 FAB 需要改成新增\"分類\"層級，長按分類卡片，可以編輯分類名稱以及增加新 Task 到該分類中; 單點一下分類維持進入該分類檢視"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 快速建立分類 (Create Category via FAB) (Priority: P1)

使用者在首頁想要組織新的任務主題時，可以透過右下角的浮動動作按鈕 (FAB) 快速建立一個新的「分類」。這取代了原本 FAB 直接建立任務的行為，讓首頁的操作邏輯更符合「以分類為核心」的設計。

**Why this priority**: 這是首頁導航與組織架構的核心變更，影響使用者建立資料的第一步。

**Independent Test**: 驗證點擊首頁 FAB 會彈出建立分類的介面（如 Drawer 或 Dialog），且完成後首頁會顯示新分類。

**Acceptance Scenarios**:

1. **Given** 使用者在首頁, **When** 點擊右下角 FAB, **Then** 應開啟「新增分類」的 Drawer。
2. **Given** 新增分類 Drawer 已開啟, **When** 輸入分類名稱並儲存, **Then** 系統應建立該分類並關閉 Drawer，首頁概覽應即時更新。

---

### User Story 2 - 分類卡片長按管理 (Category Long-press Management) (Priority: P1)

使用者在首頁分類卡片上執行長按動作，系統應彈出操作選單。該選單提供「編輯分類名稱」以及「新增任務」兩個核心功能，讓使用者無需進入詳情頁即可進行快速管理。

**Why this priority**: 提供高效的快速操作路徑，解決頻繁切換頁面的痛點。

**Independent Test**: 長按任一分類卡片，驗證彈出的 Drawer 包含「編輯名稱」與「新增任務」選項，且功能運作正常。

**Acceptance Scenarios**:

1. **Given** 使用者在首頁, **When** 長按某個分類卡片, **Then** 應彈出「分類操作」Drawer。
2. **Given** 分類操作 Drawer 已開啟, **When** 點擊「編輯名稱」, **Then** 應進入名稱編輯狀態（如原位編輯或彈窗）。
3. **Given** 分類操作 Drawer 已開啟, **When** 點擊「新增任務」, **Then** 應開啟新增任務介面，且預設分類已鎖定為當前長按的類別。

---

### User Story 3 - 進入分類詳情 (Navigate to Category Detail) (Priority: P2)

使用者單點點擊分類卡片，應維持既有行為：導向該分類的詳情頁面。這確保了快速管理與深度檢視之間的平衡。

**Why this priority**: 維持核心導航邏輯的一致性。

**Independent Test**: 驗證點擊分類卡片後，正確跳轉至 `/category/:categoryId`。

**Acceptance Scenarios**:

1. **Given** 使用者在首頁, **When** 單點點擊分類卡片, **Then** 頁面應導向該分類的詳情視圖。

---

### Edge Cases

- **長按與單點衝突**: 確保長按動作不會觸發單點的跳轉行為（事件冒泡/預設行為處理）。
- **無名稱分類**: 建立分類時若未輸入名稱，應有提示或禁止儲存。
- **重複名稱**: 雖然系統支援，但應考慮是否給予提示。
- **刪除分類後的遺留**: 必須清理所有 DailyPlanItem 關聯，防止已排程任務在分類消失後仍顯示。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **FAB 功能轉向**: 首頁 FAB 必須從「新增任務」改為「新增分類」。
- **FR-002**: **安全與捲動感知長按識別**: 分類卡片必須支援長按手勢。事件處理必須包含安全取消檢查（檢查 cancelable），並具備「捲動優先」邏輯：若偵測到顯著觸摸移動位移，應立即取消長按計時。最後，使用鎖定機制確保長按後不會觸發單點跳轉。
- **FR-003**: **分類操作抽屜 (Action Drawer)**: 長按後彈出的介面必須包含「編輯名稱」與「新增任務」選項。
- **FR-004**: **分類完整編輯對話框**: 編輯對話框必須支援更新分類的「名稱」與「標籤顏色」，並同步反映至資料庫。
- **FR-005**: **定向任務新增**: 透過長按選單新增任務時，該任務必須自動關聯至被長按的分類。
- **FR-006**: **點擊優先級處理**: 點擊與長按事件必須嚴格區分，避免使用者誤觸跳轉。
- **FR-007**: **捲動恢復保障 (Scroll Restoration)**: 系統必須確保所有彈出層（Drawer, Dialog）在關閉後能正確釋放背景捲動鎖定。即使在多層級嵌套開啟（如從 Drawer 開啟 Dialog）的情境下，關閉所有層級後必須恢復首頁 y 軸的捲動能力。

### Key Entities

- **Category**: 組織容器，包含 `name`, `color` 等屬性。
- **Task**: 具體任務，必須關聯至一個 `Category`。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 使用者從首頁發起建立新分類的操作路徑縮短至 2 步以內。
- **SC-002**: 長按反應延遲（視覺回饋）低於 100ms。
- **SC-003**: 透過長按選單建立任務的成功率應為 100%（確保關聯正確）。