# Feature Specification: Backlog Carousel Swipe Optimization (待辦清單輪播滑動優化)

**Feature Branch**: `031-backlog-swipe-optimization`  
**Created**: 2026-03-20  
**Status**: Draft  
**Input**: User description: "請研究一下'每日任務'頁面中的 Backlog Carousel 動畫，目前手機版在左右滑動時的 carousel 動畫效果還是卡卡的是為何？另外我們之前有添加一個功能是手勢滑動時會有手機震動回饋但我實際在手機上測試也沒有震動回饋出現"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 絲滑的輪播滑動體驗 (Priority: P1)

使用者在「每日計劃」頁面挑選任務時，透過左右滑動 Backlog 輪播組件切換分類。目前滑動過程存在卡頓感（Jank），使用者希望動畫能達到 60fps 的流暢度，且沒有延遲。

**Why this priority**: 這是行動端核心互動路徑的一部分，不流暢的動畫會大幅降低應用程式的質感與可用性。

**Independent Test**: 在行動端設備上打開「每日計劃」頁面並展開 Backlog，快速進行多次左右滑動切換分類，觀察動畫是否流暢、是否有掉幀或延遲現象。

**Acceptance Scenarios**:

1. **Given** Backlog 包含多個分類，**When** 使用者左右滑動，**Then** 分類卡片應即時隨手勢位移，無明顯卡頓。
2. **Given** 分類內容較多，**When** 滑動切換至相鄰分頁，**Then** 進度感知的縮放與透明度變化應平滑銜接。

---

### User Story 2 - 可感知的震動回饋 (Priority: P1)

使用者在滑動 Backlog 輪播時，當分頁成功切換（Snap）到下一個分類時，手機應提供輕微的震動回饋（Haptic Feedback），以增強操作的物理感與確定性。

**Why this priority**: 震動回饋能補償視覺回饋的不足，提升操作手感。

**Independent Test**: 在支援震動功能的行動端設備上滑動切換 Backlog 分頁，確認在分頁「吸附」到定位時是否能感受到震動。

**Acceptance Scenarios**:

1. **Given** 設備支援 `navigator.vibrate` 且未被系統禁能，**When** 輪播切換至新分頁，**Then** 觸發可感知的輕微震動。

---

### Edge Cases

- **低階設備**: 在性能較弱的設備上，應優先確保滑動可用性而非極致動效（可能需要降級動畫）。
- **瀏覽器權限**: 部分瀏覽器（如 iOS Safari 或 Chrome）可能要求初次互動後才允許震動，需確認觸發時機。
- **快速連續滑動**: 當使用者極快速連續滑動時，震動回饋與動畫不應堆疊或導致 UI 阻塞。

## Requirements *(mandatory)*

### Clarifications
### Session 2026-03-20
- Q: Carousel 捲動實作方式？ → A: 採用「分頁式」切換，取消 1:1 手勢位移連動。卡片在滑動後自動捲動至定位。
- Q: 震動回饋的調試？ → A: 增加視覺 Debug 標籤 (Toast) 用於驗證邏輯，並註記 iOS 瀏覽器之原生限制。
- Q: 不支援震動設備的備案？ → A: A (不顯示，保持素雅，無額外視覺模擬)。

## Functional Requirements

- **FR-001**: 系統必須調整輪播為「非連動分頁式」，手勢滑動僅觸發位移，取消縮放/透明度隨位移即時變化。
- **FR-002**: 系統必須實作 Haptic Debug 模式，當震動觸發時顯示開發者視覺提示。
- **FR-003**: 系統應移除 `scroll` 事件對動畫屬性的高頻寫入，改為靜態或 Snap 驅動的狀態變化。
- **FR-004**: 系統必須移除或重構可能導致佈局抖動（Layout Shift）的 Carousel 配置或動畫邏輯。

### Key Entities *(include if feature involves data)*

- **Backlog Carousel**: 任務清單的滑動容器。
- **Haptic Signal**: 驅動設備震動馬達的指令。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 行動端 Chrome DevTools 性能面板顯示滑動期間的幀率穩定在 55-60fps。
- **SC-002**: 在 Android (Chrome) 與 iOS (若支援) 設備上成功觸發切換震動。
- **SC-003**: 從滑動觸發到動畫開始的延遲（Input Latency）小於 16ms。
