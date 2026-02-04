# Feature Specification: Add Task FAB on Mobile

**Feature Branch**: `010-add-task-fab`  
**Created**: 2026-02-04  
**Status**: Draft  
**Input**: User description: "新增功能需求：手機版在首頁裡點擊分類Item進入任務畫面裡時，需要新增一個 FAB 按鈕來進行新增任務，按鈕形式跟首頁新增分類一樣，新增流程與方式也相同"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 手機版任務列表快速新增 (Mobile Task Creation via FAB) (Priority: P1)

當使用者在手機版進入特定分類的任務列表頁面時，右下角應顯示一個懸浮按鈕 (FAB)。點擊該按鈕應觸發「新增任務」的流程，其互動體驗與視覺樣式需與首頁的「新增分類」按鈕保持一致。

**Why this priority**: 這是此功能的核心需求，旨在提升手機版使用者新增任務的便利性與一致性。

**Independent Test**: 使用手機尺寸瀏覽器進入任一分類的詳細頁面，檢查右下角是否出現 FAB，並驗證點擊後能否成功建立新任務。

**Acceptance Scenarios**:

1. **Given** 使用者在手機版瀏覽器進入分類詳情頁 (Category Detail Page), **When** 頁面載入完成, **Then** 右下角應顯示一個「新增」懸浮按鈕 (FAB)。
2. **Given** 使用者看見 FAB 按鈕, **When** 點擊該按鈕, **Then** 應彈出「新增任務」的介面 (Drawer 或 Dialog)，且樣式與首頁新增分類一致。
3. **Given** 「新增任務」介面已開啟, **When** 輸入任務資訊並確認, **Then** 新任務應被建立並顯示在當前列表，且介面自動關閉。
4. **Given** 使用者在桌面版瀏覽器 (寬度大於 mobile breakpoint), **When** 進入分類詳情頁, **Then** 該 FAB 按鈕 **不應** 顯示 (除非設計統一要求，但依據需求描述強調「手機版」，此為合理推斷 [NEEDS CLARIFICATION: Desktop behavior])。

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **FAB 顯示**: 在分類詳情頁面 (Category Detail View) 中，必須在介面右下角渲染一個懸浮動作按鈕 (Floating Action Button)。
- **FR-002**: **樣式一致性**: FAB 的圖示 (Icon)、顏色、大小與陰影效果，必須與首頁 (Home Page) 的「新增分類」按鈕完全一致。
- **FR-003**: **互動流程**: 點擊 FAB 後，必須觸發與現有「新增任務」相同的 UI 流程 (例如打開 Drawer 進行輸入)。
- **FR-004**: **預設分類**: 透過此 FAB 新增任務時，系統應自動將當前所在的分類設為新任務的預設分類。
- **FR-005**: **響應式顯示**: 該 FAB 按鈕主要針對手機版介面設計，在桌面版寬度下應隱藏或調整顯示位置 (待確認)。

### Key Entities

- **Task**: 任務實體，包含標題、所屬分類 ID 等屬性。
- **Category**: 分類實體，當前頁面的上下文環境。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 在手機版介面中，進入分類詳情頁後，FAB 按鈕在 100% 的情況下可見且可點擊。
- **SC-002**: 透過 FAB 新增的任務，100% 正確關聯至當前所在的分類 ID。
- **SC-003**: 新增任務的 UI 彈出時間 (Time to Interactive) 小於 200ms。