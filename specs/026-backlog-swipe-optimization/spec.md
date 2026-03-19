# Feature Specification: Backlog Swipe Optimization (任務清單滑動優化)

**Feature Branch**: `026-backlog-swipe-optimization`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: User description: "在"每日計劃"頁面中的任務清單Backlog裡目前有實作左右手勢滑動切換任務分類的功能，但體驗上使用者覺得不夠絲滑有點卡卡的感覺，請研究該如何優化"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 絲滑的分類切換 (Priority: P1)

使用者在「每日計劃」頁面打開任務清單 (Backlog) 時，可以透過左右滑動手勢在不同的任務分類（如：工作、生活、學習等）之間流暢地切換。

**Why this priority**: 這是本功能的核心目標，直接解決使用者反應的「卡頓感」，提升整體應用的專業感與操作爽度。

**Independent Test**: 使用者可以連續左右滑動超過 5 個分類，過程中動畫平順無掉幀，且切換邏輯準確。

**Acceptance Scenarios**:

1. **Given** 使用者已開啟 Backlog 抽屜且有多個分類，**When** 使用者向左或向右快速滑動，**Then** 分類分頁應以流暢的動畫切換至下一個或上一個分類。
2. **Given** 使用者正在滑動過程中，**When** 使用者手指停留在螢幕上並左右移動，**Then** 頁面內容應精準地「跟隨」手指移動（1:1 位移回饋）。

---

### User Story 2 - 手勢衝突處理與水平鎖定 (Priority: P2)

使用者在嘗試左右滑動切換分類時，系統能準確辨識意圖，不會意外觸發垂直捲動或其他不相關的 UI 互動。此外，在切換成功時應觸發輕微的震動回饋 (Haptic Feedback) 以增加質感。

**Why this priority**: 解決「卡頓感」往往也與手勢判定衝突有關，確保滑動軸向的純粹性是提升體驗的關鍵。

**Independent Test**: 在分類內容非常長（需要垂直捲動）的情況下，使用者執行水平滑動時，垂直捲動應被暫時鎖定。

**Acceptance Scenarios**:

1. **Given** 當前分類內容很長，**When** 使用者斜向滑動但水平分量較大時，**Then** 系統應判定為分類切換並鎖定垂直捲動。

---

### User Story 3 - 邊緣回彈與視覺引導 (Priority: P3)

當使用者滑動到第一個或最後一個分類並繼續嘗試滑動時，系統應提供直觀的物理回彈效果，告知已達邊界。

**Why this priority**: 增加操作的「物理感」與「生命力」，使 UI 感覺更真實。

**Independent Test**: 在第一個分類向右滑動，應看到內容稍微位移後彈回原位。

**Acceptance Scenarios**:

1. **Given** 處於第一個分類，**When** 向右滑動，**Then** 頁面應顯示帶有阻尼感的拉伸效果並在放手後回彈。

### Edge Cases

- **快速連續滑動**: 使用者在動畫未結束前連續快速滑動多次，系統應能正確處理序列或中斷當前動畫。
- **分類數量極少**: 只有 1 個分類時，應停用滑動切換功能或僅顯示回彈。
- **網路延遲/資料載入中**: 在切換分類時若資料尚未載入完成，動畫不應因此被阻塞（應保持動畫流暢，內容異步顯示）。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系統必須確保分類切換動畫在主流行動裝置上維持 60fps。
- **FR-002**: 系統必須實作「跟手」手勢邏輯，視覺位移必須即時反應觸控點座標。
- **FR-003**: 系統必須具備水平手勢鎖定機制，防止水平切換時觸發垂直捲動 (Directional Lock)。
- **FR-004**: 系統必須支援動態的阻尼 (Damping) 與彈簧 (Spring) 物理效果，而非簡單的線性動畫。
- **FR-005**: 系統必須確保在不同螢幕寬度下，分頁切換的閾值 (Threshold) 能自動適配（例如：滑動超過 20% 寬度即觸發切換）。

### Key Entities

- **Backlog Carousel**: 代表任務清單的滑動容器，負責管理多個分類視窗的排版與切換狀態。
- **Category Slide**: 單個分類的容器，包含該分類下的任務與子任務列表。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 切換動畫的平均掉幀率 (Dropped Frames) 必須低於 5%（基準測試環境：iOS Safari / Android Chrome 於中階以上行動裝置）。
- **SC-002**: 觸控反應延遲 (Input Latency to Visual Shift) 必須小於 100ms。
- **SC-003**: 分類切換的動畫時間 (Transition Duration) 應控制在 250ms - 400ms 之間，營造絲滑感。
- **SC-004**: 使用者在 10 次嘗試水平切換中，錯誤觸發垂直捲動的次數必須為 0。
