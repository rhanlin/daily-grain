# Feature Specification: Restore Archive Management (恢復封存管理)

**Feature Branch**: `029-restore-archive-management`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: User description: "我們 app 之前是否有做'封存'的功能？ 現在是不是暫時將封存功能隱藏了？請研究並恢復此功能，確保 UX 流程完整（包含封存入口與查看/還原介面）。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 恢復任務與子任務的封存入口 (Priority: P1)

使用者可以針對「主任務」或其下的「子任務」分別進行「封存」。
- 封存主任務：該任務及其所有子任務皆從活躍清單消失。
- 封存子任務：僅該子任務隱藏，不影響主任務。

**Why this priority**: 這是最基礎的操作對稱性，確保使用者能細粒度地管理資料可見性。

**Independent Test**: 在子任務的更多選單中點擊「封存」，子任務立即隱藏，且在 IndexedDB 中該子任務被標記為 `isArchived: true`。

**Acceptance Scenarios**:

1. **Given** 使用者位於任務詳情頁，**When** 點擊子任務旁的「封存」按鈕，**Then** 子任務從當前列表中隱藏。
2. **Given** 子任務已被封存，**When** 查看「每日計劃」的 Backlog 或計畫列表時，**Then** 該子任務不應出現。

---

### User Story 2 - 封存管理介面與還原功能 (Priority: P2)

使用者可以進入一個專門的「封存中心」或在設定中查看所有已封存的分類與任務，並能選擇將其「還原」回活躍狀態。

**Why this priority**: 封存不等於刪除，必須提供一個安全的地方讓使用者找回資料，這是完整的資料生命週期管理。

**Independent Test**: 進入封存管理頁面，看到先前封存的任務，點擊「還原」後，該任務重新出現在原本的分類活躍列表中。

**Acceptance Scenarios**:

1. **Given** 使用者進入「封存管理」，**When** 列表顯示已封存的項目，**Then** 每個項目旁應有「還原」與「永久刪除」選項。
2. **Given** 使用者點擊「還原」，**When** 該項目的分類也處於封存狀態，**Then** 系統應提示是否一併還原分類或將任務移至其他活躍分類。

---

### User Story 3 - 分類層級的封存管理 (Priority: P3)

使用者可以封存整個「分類」。封存分類時，其下屬的所有任務應一併標記為隱藏，且分類不再出現在側邊欄或主要導覽中。

**Why this priority**: 處理大規模資料清理的效率工具。

**Independent Test**: 封存一個包含 5 個任務的分類，驗證該分類從側邊欄消失，且該分類下的所有任務在資料庫中狀態正確。

**Acceptance Scenarios**:

1. **Given** 使用者封存一個分類，**When** 操作完成後，**Then** 該分類及其所有任務均不應在活躍視圖中可見。

### Edge Cases

- **重複還原**: 還原時若原分類已被永久刪除，系統應引導使用者建立新分類或移至「預設分類」。
- **同名衝突**: 還原時若活躍列表中已有同名任務，系統應允許並行存在但加上時間戳記或提示。
- **大量資料**: 當封存項目超過 100 筆時，封存管理頁面應具備基礎的搜尋或過濾功能（按類型：分類/任務）。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系統必須在 `TaskItem` 的更多操作選單中顯示「封存任務」選項。
- **FR-002**: 系統必須提供一個獨立的視圖（如 `/archive` 或設定中的 Modal）來列出所有 `isArchived: true` 的分類與 `status: 'ARCHIVED'` 的任務。
- **FR-003**: 封存管理介面必須支援「一鍵還原」操作，恢復資料的活躍狀態。
- FR-004: 系統必須確保已封存的項目在 `useBacklog`, `useDailyPlan`, `useSubTask` 等活躍資料 Hook 中被排除。

- **FR-005**: 系統必須支援對已封存項目的「永久刪除」操作，徹底從資料庫移除。

### Key Entities *(include if feature involves data)*

- **Category**: 使用 `isArchived` 標記。
- **Task**: 使用 `status: 'ARCHIVED'` 標記。
- **SubTask**: 雖無獨立封存狀態，但其可見性應隨父任務（Task）連動。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 封存操作的 UI 回饋延遲應低於 100ms。
- **SC-002**: 封存管理頁面能正確載入並顯示 100% 在資料庫中標記為封存的項目。
- **SC-003**: 使用者在 3 次點擊內即可完成「還原」一個已封存的任務。
