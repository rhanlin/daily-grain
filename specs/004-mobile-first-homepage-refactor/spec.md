# Feature Specification: Mobile-First Homepage Refactor

**Feature Branch**: `004-mobile-first-homepage-refactor`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "根據移動裝置體驗優先以及 UX 最佳原則，我要來進行首頁的修改，功能維持目前既有功能，但是 UI 上我需要調整： 1. 首頁主題是 "分類"，並且能在首頁快速編輯各種資料庫裡的資料內容，因此我認為應該全螢幕空間都留給“主題分類”這個 section，原本上方有 "快速新增任務" 則可以類似每日計劃的 Backlog 或是其他當代手機 action buttom 的設計不要影響首頁的主要視覺呈現; 2. 快速新增任務的按鈕需要位於手持手機裝置最容易點擊到的位置，並且快速新增任務的流程必須簡化、操作直覺; 3. 在首頁裡的主題分類，現行的版本在手機裝置上太難閱讀了，寬度不夠導致我連 Task, SubTask 標題都看不清楚需要優化這個 section 的顯示方式; 4. 呈3. 我認為也許可以設計第一頁總覽可以看到分類，點擊進去分類裡再由完整頁面呈現該份類裡的所有 Task，這個做法僅提供參考，請你研究如何優化視覺體驗"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 分類總覽與快速操作 (Category Overview & Quick Actions) (Priority: P1)

使用者進入首頁後，能看到清晰的「主題分類」總覽。首頁不再被雜亂的輸入框佔據，而是以分類為核心。使用者可以透過位於手機操作熱區的浮動動作按鈕 (FAB) 快速觸發任務建立流程。

**Why this priority**: 這是首頁的核心價值，提供清晰的組織架構與高效的入口。

**Independent Test**: 驗證首頁全螢幕顯示分類列表，且右下角有 FAB 可點擊。

**Acceptance Scenarios**:

1. **Given** 使用者開啟首頁, **When** 查看螢幕內容, **Then** 應看到以卡片或列表形式排列的「主題分類」, 且無頂部固定新增任務欄位。
2. **Given** 使用者手持手機, **When** 點擊右下角的「+」按鈕, **Then** 應開啟簡化的新增任務介面 (如 Drawer 或 Overlay)。

---

### User Story 2 - 分類詳情下鑽 (Category Drill-down) (Priority: P2)

使用者點擊特定的主題分類後，頁面應切換至該分類的詳情視圖。詳情頁面提供充足的寬度來展示任務 (Task) 與子任務 (SubTask)，確保文字標題清晰易讀，解決移動端寬度不足的問題。

**Why this priority**: 解決目前移動端可讀性差的痛點，提供沉浸式的編輯與查看環境。

**Independent Test**: 點擊分類卡片後，頁面正確跳轉並以完整寬度顯示該分類下的任務。

**Acceptance Scenarios**:

1. **Given** 使用者在首頁分類列表, **When** 點擊「工作」分類, **Then** 頁面應導向「工作」詳情頁, 顯示所有關聯任務。
2. **Given** 在分類詳情頁, **When** 查看任務列表, **Then** 任務名稱應完整顯示而不被擠壓。

---

### User Story 3 - 簡化新增任務流程 (Simplified Task Creation) (Priority: P3)

透過 FAB 觸發的新增任務流程必須極致簡化。使用者只需輸入最核心的資訊 (如標題)，即可快速建立任務，不應被複雜的表單打斷思維。

**Why this priority**: 敏捷思維強調快速捕捉靈感與任務。

**Independent Test**: 驗證從點擊 FAB 到完成任務建立的步驟少於 3 步。

**Acceptance Scenarios**:

1. **Given** 快速新增 Drawer 已開啟, **When** 輸入任務名稱並按下確認, **Then** 任務應立即建立於預設分類中，且 Drawer 自動關閉。

---

### Edge Cases

- **無分類時的狀態**: 若使用者尚未建立任何分類，首頁應顯示引導建立分類的 Empty State。
- **極長標題處理**: 即使在詳情頁，若任務標題極長，應有適當的截斷或換行策略以維持佈局美觀。
- **返回導航**: 使用者從分類詳情頁應能直覺地返回分類總覽首頁。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **首頁佈局重構**: 首頁必須以「主題分類」為視覺主體，移除頂部固定的快速新增欄位。
- **FR-002**: **浮動動作按鈕 (FAB)**: 必須在首頁右下角實作一個 FAB，用於觸發快速新增任務。
- **FR-003**: **下鑽導航 (Drill-down Navigation)**: 點擊分類項目必須導向獨立的分類詳情頁面或全螢幕視圖。
- **FR-004**: **分類詳情視圖層次化**: 詳情頁面必須以內聯嵌套列表方式同時呈現任務與子任務。必須透過縮排、字體大小差異及視覺引導線（Visual Guides）優化橫向與縱向空間利用，確保在高密度數據情境下的導航效率。
- **FR-005**: **簡化新增 Drawer**: 快速新增功能應以 Drawer (移動端) 或 Popover (桌面端) 形式呈現，專注於最小化輸入欄位。
- **FR-006**: **全能型詳情編輯**: 分類詳情頁面必須支援透過長按觸發 Action Drawer 來編輯任務或子任務的標題、狀態、優先級 (Eisenhower) 等屬性。
- **FR-007**: **一致性編輯體驗**: 詳情頁的操作邏輯必須與每日計畫頁面保持高度一致，確保使用者在不同場景下的操作習慣無縫銜接。

### Key Entities

- **Category**: 組織任務的容器。
- **Task**: 具體的工作項。
- **SubTask**: 任務的細分項。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 使用者在移動端首頁建立任務的時間應低於 5 秒。
- **SC-002**: 分類詳情頁面的載入時間應低於 300ms (基於本地資料)。
- **SC-003**: 任務標題在移動端詳情頁的平均可視字數提升 50% 以上。
- **SC-004**: 使用者從首頁進入特定任務的操作步驟保持在 2 步以內 (點擊分類 -> 查看任務)。