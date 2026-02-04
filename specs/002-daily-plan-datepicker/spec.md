# Feature Specification: Daily Plan Date Picker

**Feature Branch**: `002-daily-plan-datepicker`
**Created**: 2026-02-03
**Status**: Draft
**Input**: User description: "在每日計劃頁面裡，點擊上方日期可以展開 Date Picker 直接點選跳到該日期，移動裝置的 Date Picker 希望也是用 Drawer 處理以確保符合使用者體驗的一致，電腦版則不侷限於此設計"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 快速切換日期 (Date Navigation) (Priority: P1)

使用者在每日計劃頁面，能夠點擊標題日期的顯示區域，喚出日期選擇器，並快速跳轉至指定日期。

**Why this priority**: 這是核心導航功能，讓使用者能規劃未來或檢視過去。

**Independent Test**: 驗證點擊日期後能開啟選擇器，選定日期後頁面正確更新至該日期的計畫。

**Acceptance Scenarios**:

1. **Given** 使用者在每日計劃頁面 (移動版), **When** 點擊頂部日期, **Then** 底部應彈出 Drawer 顯示月曆。
2. **Given** 使用者在每日計劃頁面 (桌面版), **When** 點擊頂部日期, **Then** 日期下方應彈出 Popover 顯示月曆。
3. **Given** 日期選擇器已開啟, **When** 點擊「2026-03-01」, **Then** 選擇器關閉，且頁面標題與計畫內容更新為 2026-03-01。

### Edge Cases

- 點擊目前已選中的日期，是否重新載入？(應保持不變或僅關閉選擇器)
- 快速連續切換日期時的效能表現。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **點擊觸發 (Click Trigger)**: 每日計劃頁面的頂部日期標題必須是可點擊的 (Clickable)。
- **FR-002**: **移動版互動 (Mobile Interaction)**: 在移動裝置上，點擊日期應開啟一個 **抽屜 (Drawer)**，內含月曆選擇器，以保持與任務清單 (Backlog) 的操作體驗一致。
- **FR-003**: **桌面版互動 (Desktop Interaction)**: 在桌面裝置上，點擊日期應開啟一個 **浮動視窗 (Popover)**，內含月曆選擇器。
- **FR-004**: **日期更新 (Date Update)**: 選擇日期後，系統必須更新 `selectedDate` 狀態，並連動更新每日計劃列表與任務清單 (Backlog) 的過濾邏輯。
- **FR-005**: **當前日期標示 (Current Selection)**: 月曆開啟時，應預設選中並標示目前頁面所顯示的日期。
- **FR-006**: **視覺回饋 (Visual Feedback)**: 頂部日期標題應有適當的 Hover/Active 樣式 (如底色變化或圖示)，提示其可點擊性。

### Key Entities

- **SelectedDate**: 全域或頁面級狀態，控制目前檢視的日期。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 使用者能在 3 次點擊內切換至當前月份的任意日期。
- **SC-002**: 在移動裝置上，日期選擇器的開啟動畫流暢，無明顯延遲。
- **SC-003**: 切換日期後，每日計劃列表的更新時間低於 200ms (Local-first)。