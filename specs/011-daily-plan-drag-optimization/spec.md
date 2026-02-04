# Feature Specification: Daily Plan Drag Optimization

**Feature Branch**: `011-daily-plan-drag-optimization`  
**Created**: 2026-02-04  
**Status**: Draft  
**Input**: User description: "在 /daily-plan 頁面裡，手機版目前有支援手機拖曳變更計劃項目中的排序，但因為同時有長按展開"從今日計劃中移除"的 Drawer，因此操作上容易有衝突發生，例如我只是要調整排序卻一直打開 Drawer，這裡需要優化"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 順暢的手機版排序體驗 (Seamless Mobile Reordering) (Priority: P1)

使用者在手機上瀏覽每日計劃 (Daily Plan) 時，希望能輕鬆地透過拖曳來調整任務的順序。目前長按手勢同時用於「觸發排序」與「展開移除選單」，導致使用者在嘗試移動項目時經常誤觸選單。優化後，這兩種操作應有明確的區隔，確保拖曳排序流程不被中斷。

**Why this priority**: 每日計劃是應用的核心頁面，排序是高頻操作。解決手勢衝突是提升「原生感」體驗的關鍵。

**Independent Test**: 在手機版每日計劃頁面，嘗試連續進行 5 次任務排序調整，驗證是否能在不觸發「從今日計劃中移除」Drawer 的情況下完成。

### Acceptance Scenarios

1. **Given** 使用者位於每日計劃頁面 (手機版), **When** 點擊並按住任務卡片的「專屬拖曳區塊」(Drag Handle), **Then** 應立即進入排序模式，且 **不應** 彈出選單。
2. **Given** 使用者進入排序模式, **When** 在螢幕上上下移動手指, **Then** 任務卡片應隨手指位置即時變動排序。
3. **Given** 使用者點擊任務卡片右側的「更多操作」(MoreHorizontal Icon), **Then** 應彈出「從今日計劃中移除」的 Drawer 選單。
4. **Given** 使用者對任務卡片進行「長按」操作, **Then** 系統不應有任何反應 (已移除全站長按手勢)。

---

## Requirements *(mandatory)*



### Clarifications

#### Session 2026-02-04

- Q: MoreHorizontal 圖示放置位置？ → A: 卡片最右側

- Q: 是否徹底移除所有長按行為？ → A: 是，全站統一移除長按並以選單圖示取代

- Q: 依矩陣排序時的拖曳行為？ → A: 禁用拖曳：開啟矩陣排序時隱藏拖曳手柄並禁止排序

- Q: 子任務的拖曳權限？ → A: 是，任務與子任務皆可拖曳

- Q: 拖曳預覽的視覺表現？ → A: 懸浮卡片：拖曳時顯示一個半透明且浮動在列表上方的項目副本 (DragOverlay)

- Q: 進入排序模式的觸覺/視覺回饋？ → A: 強回饋：抓取時卡片微幅縮放 + 手機輕微震動 (Vibrate)



### Functional Requirements



- **FR-001**: **專屬拖曳手柄 (Drag Handle)**: 在每日計劃的任務卡片中，需新增一個視覺明顯的拖曳手柄圖示 (例如：六點抓取圖示 `GripVertical`)。

- **FR-002**: **手勢隔離**: 限制 `dnd-kit` 的觸控感應器 (Touch Sensor) 僅在點擊「拖曳手柄」時啟動排序邏輯。

- **FR-003**: **移除長按手勢**: 系統必須移除全站 (包括 Daily Plan、Category List 等) 所有的 `useLongPress` 互動行為，避免與系統或拖曳手勢衝突。

- **FR-004**: **新增選單按鈕**: 在任務卡片最右側新增一個 `MoreHorizontal` 按鈕，點擊後觸發原本與長按關聯的操作選單 (Drawer)。

- **FR-005**: **防誤觸延遲**: 優化觸控感應器的 `activationConstraint` (延遲與容錯位移)，確保輕微的滑動不會被誤判為拖曳。

- **FR-006**: **穩定排序修正**: 分類詳情頁面的任務列表排序必須由 `updatedAt` 改為 `createdAt` (需新增此欄位)，確保在更新屬性時列表順序不會發生跳動。

- **FR-007**: **排序模式衝突處理**: 當「依矩陣排序」功能開啟時，系統必須自動隱藏 `DragHandle` 並禁用 `dnd-kit` 的排序功能，以避免手動排序與自動排序邏輯衝突。

- **FR-008**: **容器識別碼一致性**: `DailyPlanView` 的 `SortableContext` 必須正確配置 ID 為 `'daily-plan'`，確保拖曳事件能與 `DailyPlanPage` 的處理邏輯正確對接。

- **FR-009**: **拖曳預覽 (Drag Overlay)**: 拖曳時必須啟用 `DragOverlay` 元件，動態渲染當前拖曳項目的副本，並在移動時跟隨指標。

- **FR-010**: **抓取操作回饋**: 成功抓取手柄後，該項目應顯示微幅縮放效果，且若裝置支援震動 (navigator.vibrate)，應觸發一次 50ms 的觸覺震動。

### Key Entities

- **Daily Plan Item**: 包含排序索引 (Order Index) 的任務或子任務實體。
- **Touch Sensor Config**: 定義手勢觸發的臨界值與區域。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 在手機版進行 20 次拖曳排序測試，Drawer 誤觸次數應為 0。
- **SC-002**: 拖曳排序的啟動響應時間小於 100ms。
- **SC-003**: 任務排序變更後，IndexedDB 中的 `orderIndex` 100% 正確同步更新。