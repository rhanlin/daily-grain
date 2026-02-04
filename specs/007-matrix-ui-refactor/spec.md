# Feature Specification: Eisenhower Matrix UI Refactor

**Feature Branch**: `007-matrix-ui-refactor`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "在艾森豪矩陣裡，目前的樣式在手機版介面呈現上不夠友善，有兩個方向需要調整： 1. 四象限的樣式不夠直覺，目前用四張卡牌呈現的方式希望能調整成更接近扁平化Quadrant的介面樣式，並且四個象限底色需要有所區分，Q1 使用 "#cee9f2" 表示 DO, Q2 使用 "#d0ebca" 表示 DECIDE, Q3 使用 "#fddfbd" 表示 DELEGATE, Q4 使用 "#fca2a1" 表示 ELIMINATE，這些顏色的設置要確保同步到此專案裡。 並且無需在每個象限內標註類似"I. 重要且緊急" 字樣，可以用 x,y 軸標記方式呈現。 2. 每個象限中的 Task 最好帶有 Category 標示，且目前由上往下排列的做法會導致某個象限高度被無限延伸，尤其在手機版上體驗極差需要改善"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 扁平化四象限視覺化 (Flat Quadrant Visualization) (Priority: P1)

使用者進入艾森豪矩陣頁面時，能看到一個簡潔、扁平化的 2x2 網格介面。每個象限擁有專屬的底色以區分「執行、決定、委派、消除」四種行動。介面不再顯示繁瑣的標題，而是透過橫軸與縱軸的標記來引導使用者理解維度。

**Why this priority**: 這是提升矩陣直覺性的核心視覺變更。

**Independent Test**: 驗證矩陣以 2x2 網格顯示，且底色完全符合色碼要求 (#cee9f2, #d0ebca, #fddfbd, #fca2a1)，並移除原有的象限標題。

**Acceptance Scenarios**:

1. **Given** 使用者在矩陣頁面, **When** 查看螢幕, **Then** 應看到四個不同顏色的區塊，且背景色分別為指定的十六進位碼。
2. **Given** 矩陣視圖, **When** 觀察邊界, **Then** 應看到 X 軸與 Y 軸的標籤（如：緊急度、重要度）。

---

### User Story 2 - 帶有分類標示的任務列表 (Tasks with Category Indicators) (Priority: P1)

在矩陣的每個象限中，任務項目應清晰顯示其所屬的「分類」(Category)。這讓使用者在決策優先順序時，能同時掌握任務的背景脈絡。

**Why this priority**: 提升任務在矩陣中的資訊密度與可識別度。

**Independent Test**: 驗證每個任務項目旁皆有一個代表其分類的視覺標示（如顏色圓點或標籤）。

**Acceptance Scenarios**:

1. **Given** 任務 A 屬於「工作」分類, **When** 在矩陣中顯示時, **Then** 任務 A 旁應出現「工作」分類的顏色標示。

---

### User Story 3 - 行動裝置高度優化 (Mobile Height Optimization) (Priority: P2)

使用者在手機上查看矩陣時，不論某個象限內的任務數量多寡，整體介面應保持穩定，不會因為單一象限過長而導致頁面無限延伸。象限內部應具備獨立的捲動機制。

**Why this priority**: 解決目前行動端操作體驗極差的技術債。

**Independent Test**: 在 Q1 放入超過 20 筆任務，驗證 Q1 區塊不會將 Q3 擠出螢幕外，且 Q1 內部可進行捲動。

**Acceptance Scenarios**:

1. **Given** 手機裝置檢視, **When** 某象限任務溢出, **Then** 該區塊應啟用內部 y 軸捲動，且維持 2x2 網格佈局。

---

### Edge Cases

- **任務名稱極長**: 在有限的象限寬度內，任務標題應有截斷或換行策略。
- **無任務狀態**: 象限為空時，應維持底色填滿，不應導致佈局坍塌。
- **螢幕旋轉**: 在手機橫向顯示時，矩陣應能維持比例或有適當的響應式調整。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **扁平化 2x2 佈局**: 系統必須將矩陣改為 2x2 網格，採用 1px 的細微間距 (`gap-px`) 以呈現俐落的十字軸線，取代目前的卡片組。
- **FR-002**: **象限色彩規範**: 
    - Q1 (DO): 背景必須為 `#cee9f2`
    - Q2 (DECIDE): 背景必須為 `#d0ebca`
    - Q3 (DELEGATE): 背景必須為 `#fddfbd`
    - Q4 (ELIMINATE): 背景必須為 `#fca2a1`
- **FR-003**: **軸線標記系統**: 移除象限內的文字標題，改以外部或重疊的 X/Y 軸標記（X 軸：緊急度 (Urgency)，Y 軸：重要度 (Importance)）呈現。
- **FR-004**: **分類視覺連結**: 每個矩陣項目必須包含其關聯分類的顏色指示器或簡短標籤。
- **FR-005**: **行動端精確高度適配**: 矩陣容器在行動端必須使用 `100dvh` 扣除固定 UI 偏移量進行高度計算，確保 2x2 網格完美撐滿剩餘空間且無外部捲軸。網格行高必須強制維持 50/50 比例 (`1fr 1fr`)，並整合獨立內部捲動區域。
- **FR-006**: **極大化視覺空間**: 頁面必須移除標題 (Eisenhower Matrix) 與描述文字，確保四象限能佔據最大可視範圍。
- **FR-007**: **浮動過濾選單 (FAB Filter)**: 將原本的 Tabs 切換功能改為浮動動作按鈕 (FAB) 形式，點擊後彈出選單進行切換。
- **FR-008**: **緊湊軸線佈局**: Y 軸指示標記必須移除不必要的邊距 (Padding)，實現與螢幕邊緣的緊湊對齊。

### Key Entities

- **Task**: 具備優先級屬性 (Q1-Q4) 的實體。
- **Category**: 提供顏色與名稱資訊的組織實體。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 矩陣色彩配置與使用者提供之色碼 100% 吻合。
- **SC-002**: 矩陣總高度動態適配並撐滿螢幕剩餘空間，2x2 結構永遠保持對稱比例（橫縱 50/50），不因項目多寡導致佈局坍塌或高度不一。
- **SC-003**: 任務分類的可視識別率提升（使用者能在不點開詳情的情況下分辨任務類別）。