# Feature Specification: Fix Swipe Conflict with Overlays

**Feature Branch**: `016-fix-swipe-conflict`  
**Created**: 2026-02-06  
**Status**: Draft  
**Input**: User description: "目前專案有個 Bug，我們為了模擬原生 app 手勢控制，例如在每日計劃中可以左右滑動手勢來切換日期，但是當 sub-ticket 編輯標題的 Dialog 或 Drawer 出現時，user 的左右滑動手勢仍會影響在背景切換背景，此問題需要修正"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 防止背景滑動 (Prevent Background Swipe) (Priority: P1)

當使用者在每日計畫頁面開啟任何蓋在畫面上的 UI（例如編輯標題的對話框 Dialog 或任務資訊的抽屜 Drawer）時，原本用於切換日期的左右滑動手勢應被暫時禁用。這可以避免使用者在與前景視窗互動時，意外導致背景的日期發生變更。

**Why this priority**: 這是嚴重的互動衝突 Bug，會導致使用者在輸入資料或查看詳細資訊時遺失內容或感到困惑，嚴重影響 UX。

**Independent Test**: 開啟每日計畫頁面，點擊一個項目的更多圖示展開 Drawer。在 Drawer 上進行左右滑動，驗證背景的日期是否保持不變。

**Acceptance Scenarios**:

1. **Given** 每日計畫頁面已載入, **When** 任何 Dialog (如編輯標題) 為開啟狀態, **Then** 左右滑動手勢不應觸發日期切換。
2. **Given** 每日計畫頁面已載入, **When** 任何 Drawer 為開啟狀態, **Then** 左右滑動手勢不應觸發日期切換。
3. **Given** 所有 Overlay (Dialog/Drawer) 皆已關閉, **When** 在任務區域滑動, **Then** 手勢功能應恢復正常。

---

### Edge Cases

- **手勢判定**: 需確保在 Overlay 區域觸發的手勢不會穿透 (Bubble up) 到背景的滑動監聽器。
- **狀態同步**: 需正確偵測 Overlay 的開啟與關閉狀態，確保手勢禁用的生命週期與 Overlay 一致。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **手勢阻斷機制**: 當系統偵測到全域或特定區域存在開啟的 Overlay (Dialog/Drawer) 時，必須停用 `useSwipe` 的邏輯判定。
- **FR-002**: **狀態感知**: `DailyPlanView` 應能感知其內部的 `Dialog` 或 `Drawer` 是否處於開啟狀態。
- **FR-003**: **事件冒泡控制**: (如果必要) 應在 Overlay 元件上阻止手勢相關事件向外傳遞。

### Key Entities

- **DailyPlanView**: 目前負責日期切換與渲染 Overlay 的主元件。
- **useSwipe**: 執行滑動邏輯的自定義 Hook。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 在 Overlay 開啟時，100% 阻斷日期切換觸發。
- **SC-002**: 在 Overlay 關閉後，手勢功能的恢復延遲小於 100ms。
- **SC-003**: 此修正不應破壞原有的垂直捲動功能。