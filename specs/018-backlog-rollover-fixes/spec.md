# Feature Specification: Backlog and Rollover Fixes

**Feature Branch**: `018-backlog-rollover-fixes`  
**Created**: 2026-02-06  
**Status**: Draft  
**Input**: User description: "目前有幾個 issue 需要修正： 1. 在每日計劃的 Backlog Drawer 裡，當我們使用\"多選\"模式時，下方會在出現行動按鈕面板(取消, 加入今日計劃)，此時行動按鈕面板會遮住部分 Backlog Drawer 內的選項導致 Drawer 即便捲動到最下方項目仍被遮擋; 2. 在每日計劃的 Backlog Drawer 裡，當我們使用\"多選\"模式時，scroll 行為會導致意外點擊選取到其他項目，且 scroll 後原本選取的項目會取消選取，變成選到 scroll 時碰到的 item 3. 每日計劃頁面裡，針對已加入當入計劃的項目，如果進入到隔天時該項目仍未完成，則應該要自動延宕到隔日，但目前這項功能似乎只有一筆資料會順利延宕到隔日，其餘尚未完成的項目會回到 Backlog 裡"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 修正備忘清單多選介面遮擋 (Fix Backlog Multi-select UI Overlap) (Priority: P1)

使用者在「每日計畫」開啟備忘清單 (Backlog Drawer) 並進入「多選模式」時，底部的行動按鈕面板（包含「取消」與「加入今日計畫」）不應遮擋列表中的最後幾個項目。即使捲動到最下方，使用者也應能看清楚並選取所有項目。

**Why this priority**: 確保功能可用性，避免使用者無法選取列表末端的任務。

**Independent Test**: 開啟 Backlog Drawer，進入多選模式，確認列表最下方的項目是否能完整呈現，且不會被浮動按鈕面板蓋住。

**Acceptance Scenarios**:

1. **Given** 處於 Backlog 多選模式, **When** 捲動到列表最底部, **Then** 所有項目內容應在按鈕面板上方完整顯示。

---


### User Story 2 - 修正備忘清單多選捲動衝突 (Fix Backlog Multi-select Interaction) (Priority: P1)

使用者在 Backlog 多選模式下進行捲動 (Scroll) 操作時，系統應區分「捲動意圖」與「選取意圖」。捲動行為不應導致手指觸碰到的項目被意外選取或取消選取，且原本已選取的項目狀態應被正確保留。

**Why this priority**: 修復嚴重的互動 Bug，防止使用者在操作過程中感到挫折。

**Independent Test**: 在多選模式下選取數個項目，然後快速上下捲動列表，驗證：
1. 已選取的項目是否維持選取。
2. 捲動結束時，手指最後停留的項目是否被意外變更狀態。

**Acceptance Scenarios**:

1. **Given** 已選取部分項目, **When** 使用滑動手勢捲動列表, **Then** 捲動過程不應觸發 `onToggleSelection`。
2. **Given** 捲動列表後手指放開, **Then** 不應誤觸最後接觸點的項目選取狀態。

---


### User Story 3 - 修正多項目自動延宕邏輯 (Fix Multi-item Daily Plan Rollover) (Priority: P1)

當日期進入隔天時，前一天每日計畫中「尚未完成」的所有項目都應自動延宕 (Rollover) 到當天的計畫中。目前系統僅能成功延宕一筆資料，其餘會錯誤地回到 Backlog。

**Why this priority**: 核心業務邏輯修正，確保使用者不會遺漏未完成的任務。

**Independent Test**: 
1. 在 2026-02-05 的計畫中加入 3 個未完成的項目。
2. 將系統日期或模擬日期切換至 2026-02-06。
3. 驗證 2026-02-06 的計畫中是否自動出現了這 3 個項目，且標註為「延宕」。

**Acceptance Scenarios**:

1. **Given** 昨天的計畫中有 N 個未完成項目, **When** 觸發延宕邏輯 (進入新的一天), **Then** 這 N 個項目應全數出現在今天的計畫清單中。

---


### Edge Cases

- **列表長度**: 當 Backlog 項目極少時，底部 padding 是否會導致視覺過空。
- **捲動速度**: 極快速滑動是否會增加誤觸機率。
- **跨多日未進入**: 若使用者跨了兩天以上才開啟 App，延宕邏輯是否能正確累加或追溯。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **UI 配置**: Backlog Drawer 的 ScrollArea 在多選模式啟動時，必須具備額外的底部間距 (Bottom Padding)，其高度需大於等於浮動按鈕面板的高度。
- **FR-002**: **手勢隔離**: 在多選模式下，項目點擊偵測必須具備防誤觸機制，確保僅在「單純點擊」而非「滑動結束」時觸發選取狀態切換。
- **FR-003**: **批次延宕處理**: 延宕邏輯 (Rollover logic) 必須遍歷並處理前一日所有符合條件的 `dailyPlanItems`，確保不因單一操作失敗或邏輯中斷而遺漏項目。
- **FR-004**: **延宕狀態標記**: 確保所有延宕項目在寫入新日期時，`isRollover` 屬性正確設為 `true`。

### Key Entities

- **DailyPlanItem**: 包含日期、完成狀態、順序索引與延宕標記。
- **Backlog Drawer**: 提供任務選取的容器。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 進入多選模式後，列表最後一項與按鈕面板頂端的間距至少為 16px。
- **SC-002**: 指標位移超過 10px 的捲動手勢，誤觸選取 (Toggle) 的次數應為 0。
- **SC-003**: 模擬 10 個未完成項目的跨日測試，延宕成功率應為 100%。