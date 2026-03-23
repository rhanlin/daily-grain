# Feature Specification: Backlog Routine Filter (待辦清單例行性任務過濾)

**Feature Branch**: `030-backlog-routine-filter`  
**Created**: 2026-03-20  
**Status**: Draft  
**Input**: User description: "我們上次在 028-move-subtask-filter-daily 有作的一項功能：隱藏每日任務，該功能目前只有在 '每日計劃' 頁面上可以 filter，我想要把相同的功能也添加到 '每日計劃/Backlog' 裡，目的是讓 user 在添加每日計劃時也能暫時先過濾掉每日任務"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 在待辦清單中隱藏例行任務 (Priority: P1)

使用者在「每日計劃」頁面打開「從待辦挑選」(Backlog) 視窗時，可以透過切換開關隱藏所有「每日」類型的子任務。這能幫助使用者在規劃當天行程時，專注於處理一次性或非例行性的任務，減少列表的視覺干擾。

**Why this priority**: 這是本功能的核心需求，直接解決使用者在長列表中挑選任務的痛點。

**Independent Test**: 打開 Backlog 視窗，切換「隱藏每日」開關，驗證所有 `type: 'daily'` 的子任務是否從列表中消失；再次切換開關，驗證任務是否重新出現。

**Acceptance Scenarios**:

1. **Given** 待辦清單中包含多個「每日」任務與「一次性」任務，**When** 使用者開啟「隱藏每日」開關，**Then** 列表僅顯示非「每日」類型的任務。
2. **Given** 「隱藏每日」開關已開啟，**When** 使用者關閉該開關，**Then** 列表恢復顯示包含「每日」任務在內的所有可選項目。

---

### User Story 2 - 過濾狀態的一致性或獨立性 (Priority: P2)

使用者希望過濾狀態能符合預期的操作慣性。Backlog 的過濾狀態應與「每日計劃」主頁面各自獨立，互不干涉。

**Why this priority**: 提供使用者在不同視圖下擁有最大的控制彈性。

**Independent Test**: 在每日計劃頁面開啟「隱藏每日」，接著打開 Backlog 視窗，驗證 Backlog 是否仍預設顯示所有任務（或維持其獨立狀態）。

**Acceptance Scenarios**:

1. **Given** 使用者在每日計劃主頁面設定了「隱藏每日」，**When** 打開 Backlog 視窗，**Then** Backlog 預設仍顯示所有任務，且其過濾開關不受主頁面影響。

---

### Edge Cases

- 當某個分類下「所有」任務都是每日任務時，開啟過濾後該分類標題是否應隱藏？（預期：是，避免顯示空的分類區塊）。
- 如果使用者在 Backlog 搜尋特定任務，過濾器是否仍應作用？（預期：是，過濾器優先級應高於或疊加於搜尋結果）。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系統必須在「每日計劃」的 Backlog 視窗（Drawer/Sidebar）頂部提供「隱藏每日」的切換開關。
- **FR-002**: 系統必須根據子任務的 `type === 'daily'` 屬性執行過濾邏輯。
- **FR-003**: 系統在執行過濾時，若分類下無任何符合條件的任務，必須連同分類標題一併隱藏。
- **FR-004**: Backlog 的過濾開關狀態必須與主視圖各自獨立，且在視窗關閉後即重置。

### Key Entities *(include if feature involves data)*

- **SubTask**: 包含 `type` 屬性（'one-time', 'multi-time', 'daily'），作為過濾基準。
- **Backlog View State**: 儲存當前 Backlog 的過濾開關狀態。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 過濾切換的反應時間（從點擊到列表更新完成）必須低於 100ms。
- **SC-002**: 使用者在 Backlog 中開啟過濾後，列表長度平均應減少 30% 以上（視使用者資料而定，主要衡量視覺精簡效果）。
- **SC-003**: 100% 正確過濾 `daily` 類型的任務，無遺漏或誤過濾。
