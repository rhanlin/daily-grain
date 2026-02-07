# Feature Specification: Fix Mobile Calendar Drawer Overflow

**Feature Branch**: `019-fix-mobile-calendar-overflow`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "有個奇怪的 UI 問題需要修正，在手機裝置使用時，每日計劃頁面裡點擊日期從上方彈出的日曆 Drawer 內的日期內容會超出 Drawer 的容器範圍跑版，但是我在電腦本地開發在網頁上預覽模擬手機顯示卻無法重現此問題，只有真正到了手機裝置上使用 app 時會發生"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 修正手機端日曆 Drawer 跑版問題 (Fix Mobile Calendar Drawer Layout) (Priority: P1)

使用者在手機裝置上使用 App 時，點擊「每日計畫」頁面的日期以開啟日曆選擇器（Drawer）。日曆的內容（日期數字與網格）應完全包含在 Drawer 容器內，不應超出範圍或導致部分日期無法顯示或點擊。

**Why this priority**: 這是核心導覽功能的一部分，若使用者無法正常選擇日期，將嚴重影響 App 的可用性。

**Independent Test**: 在實體手機裝置（或具有正確 Safe Area 模擬的環境）開啟 App，進入每日計畫頁面，點擊日期觸發 Drawer，驗證日曆網格是否完整顯示且對齊正確。

**Acceptance Scenarios**:

1. **Given** 使用者處於每日計畫頁面並使用手機裝置, **When** 點擊日期文字開啟日曆 Drawer 時, **Then** 日曆網格應完整呈現在 Drawer 內部，無任何內容溢出。
2. **Given** 日曆 Drawer 已開啟, **When** 嘗試點擊邊緣日期或切換月份時, **Then** 互動應正常，且 UI 佈局應保持穩定。

---

### Edge Cases

- **不同手機解析度**: 在小尺寸手機（如 iPhone SE）與大尺寸手機（如 Pro Max 系列）上是否皆能正確縮放。
- **手機轉向**: 雖然 PWA 通常鎖定垂直，但若旋轉螢幕，佈局是否會崩潰。
- **動態工具列**: 行動瀏覽器導覽列彈出或隱藏時，是否會影響 Drawer 高度計算導致溢出。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **容器自適應**: 日曆 Drawer 的內容容器必須使用響應式寬度（如 `max-w-full` 或 `w-full`），確保在任何手機螢幕寬度下皆不溢出。
- **FR-002**: **高度安全區域**: Drawer 的高度計算應考量行動裝置的 Safe Area（頂部與底部），避免內容被系統狀態列或手勢條遮擋。
- **FR-003**: **精確視窗單位**: 應優先使用 `svh` 或 `dvh` (Dynamic Viewport Height) 而非 `vh`，以應對行動瀏覽器動態 UI 工具列造成的空間變化。
- **FR-004**: **日曆網格縮放**: 日曆組件內部的單元格（Cells）應根據可用空間自動調整大小，確保 7 欄佈局在小螢幕下依然完整。

### Key Entities

- **DailyPlanView**: 每日計畫的主視圖，負責觸發日曆。
- **CalendarDrawer**: 封裝日曆組件的 Drawer 容器（通常由 Shadcn UI 的 Drawer 組成）。
- **Calendar Component**: 實際顯示日期網格的邏輯組件。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 在寬度至少 320px 的手機裝置上，日曆內容溢出率為 0%。
- **SC-002**: 使用者在開啟日曆 Drawer 後，首屏可見性達 100%（不需額外捲動即可看到完整月份網格，除非刻意設計為可捲動）。
- **SC-003**: 在實體手機上的佈局表現與設計稿一致性達 100%。