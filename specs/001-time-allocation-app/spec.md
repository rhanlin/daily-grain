# Feature Specification: 個人時間分配 Web App (Personal Time Allocation App)

**Feature Branch**: `001-time-allocation-app`  
**Created**: 2026-02-01  
**Status**: Draft  
**Input**: User description: "建立一個 個人時間規劃分配的 web app，核心使用艾森豪矩陣、 敏捷思維、用時間管理技巧打造高效工作力， 讓使用者可以很快的檢視不同顆粒度的目標與任務，並且進行自我行程規劃讓忙碌的生活變得井然有序"

## Clarifications

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
- **FR-007**: 「每日計畫」預設採 **手動排序 (Manual Ordering)**，使用者可自由上下拖曳調整執行順序。若 Task 包含 Sub-tasks，僅允許拖曳 Sub-tasks 至計畫表；若 Task 無 Sub-tasks，則拖曳 Task 本身。
- **FR-008**: 「每日計畫」必須提供 **Toggle 切換**，可將視圖暫時改為依據「艾森豪權重」排序。
- **FR-009**: 系統必須具備 **Local-First PWA** 能力，確保離線時可正常讀寫資料 (IndexedDB)，並於連線後自動同步至伺服器。
- **FR-010**: 系統必須採用 **最後寫入為準 (Last-Write-Wins)** 策略處理多裝置同步衝突。
- **FR-011**: 當父任務下的所有子任務皆被勾選完成時，系統必須 **自動將父任務標記為完成**。
- **FR-012**: (Nice to have) 未來可考慮支援 Google Calendar 單向同步 (目前 MVP 不優先實作)。
- **FR-013**: **自動結算 (Rollover)**: 當日未完成的計畫項目，必須自動轉移至隔日的 Daily Plan 頂部，並以特殊樣式標註（如「延宕項目」區塊）。
- **FR-014**: **完成項目呈現**: 已完成的 Task/Sub-task 應保留在原列表中並呈現 **淡化/灰色 (Dimmed)** 樣式，不自動隱藏；使用者可手動選擇「封存」以隱藏完成項目。

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