# Feature Specification: 個人時間分配 Web App (Personal Time Allocation App)

**Feature Branch**: `001-time-allocation-app`  
**Created**: 2026-02-01  
**Status**: Draft  
**Input**: User description: "建立一個 個人時間規劃分配的 web app，核心使用艾森豪矩陣、 敏捷思維、用時間管理技巧打造高效工作力， 讓使用者可以很快的檢視不同顆粒度的目標與任務，並且進行自我行程規劃讓忙碌的生活變得井然有序"

## Clarifications

### Session 2026-02-03<--SEP-->- Q: When a user drags a sub-task to a new date, but it's already scheduled on a different date, what should happen? → A: Ask to Move (Confirmation): Show a confirmation dialog: 'This item is already on [Old Date]'s plan. Do you want to move it to [New Date]?'

- Q: When should the system check for and roll over unfinished items from past days? → A: When viewing today's plan: The app should only check for unfinished items from dates before today and only move them to today's plan.
- Q: How should the backlog filter items that are scheduled on other days? → A: Context-aware (Current behavior): The backlog should only hide items scheduled on the specific day being viewed.
- Q: How should we visually indicate that a backlog item is already scheduled on a different day? → A: Icon with Tooltip: Show a calendar icon, and display a tooltip with the scheduled date.
- Q: Which items should be draggable from the backlog into the Daily Plan? → A: Sub-tasks ONLY: Users can only drag individual sub-tasks into the plan. Parent tasks serve as containers and are not directly plannable.
- Q: How should a Sub-task item be rendered within the Daily Plan? → A: Interactive Item: Render it with a checkbox and its title, allowing users to check it off directly.
- Q: What should happen to a 'yesterday's unfinished' item's special status if it's removed from the daily plan? → A: Reset the status: When the item is removed from the plan, the 'yesterday's unfinished' marker is removed.

### Session 2026-02-01
- Q: Authentication Strategy → A: Google Sign-In Only (Simplifies auth and Calendar permission granting).
- Q: Google Calendar Sync Direction → A: One-way (App → Google Calendar). App is the source of truth.
- Q: Offline Data & Sync Strategy → A: Local-First PWA (Uses IndexedDB and Service Workers for full offline functionality).
- Q: Conflict Resolution Strategy → A: Last-Write-Wins (Timestamp-based automatic resolution).
- Q: Default Task Duration → A: 30 minutes (Standard for calendar scheduling).
- Q: Core Workflow & View Interaction → A: Workflow redefined: Category -> Task -> Subtask. Daily Plan is manual order list (no specific times). Matrix is read-only visualization.
- Q: Sub-task Scheduling Granularity → A: Hybrid. Drag Sub-tasks if they exist; otherwise drag Parent Task.
- Q: Daily Plan Rollover → A: Unfinished items auto-move to next day, pinned at top with special highlighting.
- Q: Completion Visibility → A: Completed items remain visible (dimmed) in Category/Task lists until manually archived.
- Q: Node.js Role & Architecture → A: Node LTS v24.13.0+ for development tooling only (Vite, tests). Backend remains Firebase (Auth/Sync).
- Q: Console Errors & Feedback → A: No errors reported in console when creating category.
- Q: UI Interaction & State → A: Dialog closes, text clears, but list doesn't update.
- Q: Data Persistence Verification → A: Refresh doesn't help. Data IS visible in IndexedDB DevTools, but not in UI. Root cause identified: Type mismatch (Query uses '0', Data uses 'false').
- Q: Planning Interface & Drag-and-Drop → A: Create a "Side-by-Side Planning View" (Backlog + Daily Plan) to enable Drag-and-Drop.
- Q: Eisenhower Attribute Editing → A: Click-to-Cycle Badge (Q1->Q2->Q3->Q4).
- Q: Sub-task Visibility in Matrix → A: Mixed View (Tasks + Subtasks). UX: "Focus Mode" (Click parent -> dim others) + Filters (Task/Subtask/All).
- Q: Backlog Content & Visibility → A: Unscheduled Active Tasks (Option B). Hide Done/Scheduled items.
- Q: Edit Interaction → A: Icon Triggered Inline Edit (Option A). Pencil icon toggles input mode.
- Q: Remove from Daily Plan interaction → A: Remove Icon (Option A) to unschedule item.
- Q: Deletion Behavior → A: Cascade delete (Parent Task removal removes Sub-tasks). ALL deletes require a confirmation dialog.
- Q: Interaction Constraints → A: Drag-only for scheduling (No Click-to-Add). Enforce uniqueness in Daily Plan.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 主題分類與任務建立 (Categories & Task Creation) (Priority: P1)

使用者能建立「主題分類 (Category)」，並在其中新增任務。任務預設為「不重要也不緊急 (Q4)」，可手動調整艾森豪屬性。

**Why this priority**: 這是資料結構的基礎，取代原本的收件匣概念。

**Independent Test**: 驗證建立分類後能在其下新增任務，且任務預設屬性正確。

**Acceptance Scenarios**:

1.  **Given** 使用者在首頁, **When** 建立一個「工作」分類並進入, **Then** 應能新增「撰寫報告」任務，且該任務預設為 Q4 (第四象限)。
2.  **Given** 一個既有任務, **When** 使用者勾選「重要」屬性, **Then** 該任務在唯讀的艾森豪矩陣視圖中應移動至對應象限。

---

### User Story 2 - 子任務與自動完成 (Sub-tasks & Auto-Completion) (Priority: P2)

使用者可在任務下建立「子任務 (Sub-ticket)」，子任務繼承或擁有獨立屬性。當所有子任務完成時，父任務自動標記為完成。

**Why this priority**: 提供細顆粒度的任務拆解，並透過自動化提升體驗。

**Independent Test**: 驗證子任務全部打勾後，父任務狀態自動變更為 Done。

**Acceptance Scenarios**:

1.  **Given** 一個包含 2 個未完成子任務的父任務, **When** 使用者勾選最後一個子任務, **Then** 父任務的 Checkbox 應自動變為已完成狀態。
2.  **Given** 一個父任務, **When** 新增子任務並加入描述, **Then** 該資訊應僅存於該父任務 Scope 內。

---

### User Story 3 - 每日計畫與排序 (Daily Plan & Ordering) (Priority: P3)

使用者可將任務拖入「每日計畫」，並進行手動排序（時間點不重要）。提供切換開關以「艾森豪順序」檢視當日任務。

**Why this priority**: 這是核心的「執行」介面，強調順序優於時間點。

**Independent Test**: 驗證手動拖曳排序功能，以及 Toggle 切換後排序的變化。

**Acceptance Scenarios**:

1.  **Given** 今日計畫表中有任務 A (Q4) 和任務 B (Q1), **When** 使用者手動將 A 拖至 B 上方, **Then** 列表應維持 A 在上的順序 (忽略艾森豪權重)。
2.  **Given** 同上情境, **When** 使用者開啟「艾森豪排序」Toggle, **Then** 列表應自動重排顯示 B (Q1) 在 A (Q4) 上方。
3.  **Given** 艾森豪排序模式開啟, **When** 使用者嘗試拖曳排序, **Then** 系統應提示需切換回手動模式或暫時鎖定拖曳。

---

### Edge Cases

- 當使用者刪除一個含有多個子任務的「目標」時，子任務應被保留至 Inbox 還是隨之刪除？(預設：保留並解除關聯)
- 當艾森豪矩陣中某象限任務過多（如 > 50 個）時，UI 是否能正常顯示且不卡頓？
- 跨時區使用時，任務的截止時間與「今日」定義如何處理？

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系統必須透過 **Google Sign-In** 進行使用者認證。
- **FR-002**: 系統必須提供 **主題分類 (Category)** 建立功能，任務必須隸屬於特定分類。
- **FR-003**: 建立任務時，預設艾森豪屬性為 **不重要也不緊急 (Q4)**，使用者可手動調整。
- **FR-004**: 系統必須提供 **唯讀 (Read-Only)** 的「艾森豪矩陣視圖」，以不同顏色區分四個象限，僅作為視覺化參考，不可直接編輯。
- **FR-005**: 系統必須支援 **子任務 (Sub-ticket)** 建立，包含獨立的描述與 Checkbox。
- **FR-006**: 系統必須提供「每日計畫 (Daily Plan)」，支援將任務或子任務從分類拖入特定日期。
- **FR-007**: **每日計畫拖曳規則 (Daily Plan Dragging Rule)**: 使用者僅能將 **子任務 (Sub-task)** 從待辦清單拖曳至「每日計畫」中進行排程。父任務 (Task) 本身不可被直接拖曳至計畫中。
- **FR-008**: 「每日計畫」必須提供 **Toggle 切換**，可將視圖暫時改為依據「艾森豪權重」排序。
- **FR-009**: 系統必須具備 **Local-First PWA** 能力，確保離線時可正常讀寫資料 (IndexedDB)，並於連線後自動同步至伺服器。
- **FR-010**: 系統必須採用 **最後寫入為準 (Last-Write-Wins)** 策略處理多裝置同步衝突。
- **FR-011**: 當父任務下的所有子任務皆被勾選完成時，系統必須 **自動將父任務標記為完成**。
- **FR-012**: (Nice to have) 未來可考慮支援 Google Calendar 單向同步 (目前 MVP 不優先實作)。
- **FR-013**: **自動結算 (Rollover)**: 當使用者檢視 **今日** 的計畫時，系統會自動檢查所有 **過去日期** 的計畫。任何未完成的項目都會被移動至 **今日計畫** 的頂部，並以特殊樣式標註。此檢查僅在檢視今日時觸發。
- **FR-014**: **完成項目呈現**: 已完成的 Task/Sub-task 應保留在原列表中並呈現 **淡化/灰色 (Dimmed)** 樣式，不自動隱藏；使用者可手動選擇「封存」以隱藏完成項目。
- **FR-015**: **規劃視圖 (Planning View)**: 提供「側邊欄/抽屜」式的待辦清單 (Backlog)，允許使用者將任務/子任務拖曳至每日計畫。
- **FR-016**: **艾森豪編輯**: 點擊任務卡片上的象限徽章 (Badge) 應循環切換屬性 (Q1→Q2→Q3→Q4)。
- **FR-017**: **矩陣關聯視圖**: 艾森豪矩陣顯示所有任務與子任務。點擊父任務時，應 **聚焦 (Focus Mode)** 該任務及其子任務，將其餘無關項目淡化處理。提供篩選器切換「僅顯示任務 / 僅顯示子任務 / 全部」。
- **FR-018**: **完整 CRUD**: 所有的 Category, Task, Sub-task 必須提供「編輯」與「刪除」功能。
- **FR-019**: **刪除確認**: 執行任何刪除操作前，系統必須彈出 **確認對話框 (Confirmation Dialog)**。
- **FR-020**: **級聯刪除**: 刪除父任務時，必須連帶刪除所有關聯的子任務以及該任務在每日計畫、矩陣視圖中的所有紀錄。
- **FR-021**: **計畫表排程規則**: 每日計畫僅接受 **拖曳 (Drag-and-Drop)** 加入項目，不接受點擊加入。
- **FR-022**: **全域計畫唯一性 (Global Plan Uniqueness)**: 一個任務或子任務在 **所有日期** 的計畫中，只能存在一次。它不能被同時安排在多個不同的日期。
- **FR-023**: **待辦清單 (Backlog) 過濾**: Backlog 僅顯示尚未完成且未加入當日計畫的項目。
- **FR-024**: **每日計畫互動模式 (Daily Plan Interaction Mode)**: 在「每日計畫」視圖中，任務和子任務應處於 **限制互動模式**。使用者僅能更新項目的完成狀態（例如，勾選 Checkbox）。禁止在該視圖中進行標題編輯、新增或刪除子任務等管理操作。
- **FR-025**: **子任務父層情境 (Sub-task Parent Context)**: 在「每日計畫」視圖中，每個子任務項目都必須清晰地展示其所屬的父任務標題，以便使用者理解其來源與情境。
- **FR-026**: **每日計畫中的子任務互動 (Sub-task Interaction in Daily Plan)**: 在「每日計畫」視圖中，每個子任務項目必須包含一個可互動的 **Checkbox**，允許使用者直接將其標記為完成或未完成。
- **FR-027**: **重置延宕狀態 (Rollover Status Reset)**: 如果一個被標記為「昨日未完成」的項目從任何一日的計畫中被移除（例如，被拖回到待辦清單），其「延宕」狀態必須被清除。當它再次被加入計畫時，應視為一個普通項目。
n- **FR-028**: **待辦清單排程提示 (Backlog Schedule Hint)**: 在待辦清單 (Backlog) 中，如果一個項目已經被安排在 **其他日期** 的計畫中，它的旁邊必須顯示一個日曆圖示。當滑鼠懸停在該圖示上時，應出現一個提示框 (Tooltip)，顯示其已被安排的具體日期（例如，「已排程於 2026-02-04」）。
n- **FR-029**: **移動已排程項目之確認 (Confirm Move of Scheduled Item)**: 當使用者嘗試將一個已排程在  的項目拖曳至  時，系統必須彈出一個確認對話框，詢問使用者是否要將該項目從舊日期 **移動** 至新日期。如果確認，則更新該項目的日期；如果取消，則不進行任何變更。

### Key Entities

- **User**: 使用者帳戶。
- **Category**: 任務的主題分類 (取代原 Goal 概念)。
- **Task**: 工作項目，隸屬於 Category，包含艾森豪屬性、手動排序索引。
- **SubTask**: 子任務，隸屬於 Task，包含 Checkbox 與描述。
- **DailyPlanItem**: 每日計畫中的項目，可指向 Task 或 SubTask，包含排序索引與狀態 (Rollover)。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 使用者能在 10 秒內完成一個新任務的建立與艾森豪分類。
- **SC-002**: 艾森豪矩陣視圖在 1000 個任務下，載入與渲染時間低於 1 秒。
- **SC-003**: 90% 的活躍任務都被明確歸類於艾森豪矩陣的某一象限（非未分類狀態）。
- **SC-004**: 使用者能透過單一頁面檢視「今日計畫」與「本週目標」的關聯性。