# Feature Specification: Backlog Carousel & Scrolling Layout

**Feature Branch**: `003-backlog-carousel-layout`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "在每日計劃頁面裡的 Backlog 裡，移動裝置版在 Drawer 內使用 Carousel 方式呈現不同 Category 的內容，使用者可以手勢左右切換類別；在電腦板的 Backlog 內的類別則是使用上下排列，超過容器高度則在容器內 y 軸捲動"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 移動版 Backlog 輪播瀏覽 (Mobile Backlog Carousel) (Priority: P1)

使用者在移動裝置上開啟任務清單 (Backlog) 抽屜時，能以左右滑動 (Carousel) 的方式在不同主題分類 (Category) 間切換，快速找到特定類別下的任務。

**Why this priority**: 提升移動端的瀏覽效率，避免長列表導致的過度捲動，並提供直覺的手勢操作。

**Independent Test**: 驗證移動版抽屜開啟後，各類別以橫向排列呈現，且支援手勢左右切換。

**Acceptance Scenarios**:

1. **Given** 使用者在移動裝置開啟 Backlog 抽屜, **When** 向左或向右滑動內容區, **Then** 內容應切換至下一個或上一個主題分類。
2. **Given** 輪播中的特定分類, **When** 點擊其中的任務加入計畫, **Then** 任務應正確加入計畫且不會導致輪播位置異常跳動。

---

### User Story 2 - 桌面版 Backlog 垂直捲動列表 (Desktop Backlog Vertical List) (Priority: P2)

使用者在桌面版瀏覽 Backlog 時，能看到所有類別依序由上而下排列。若內容超過側邊欄高度，可直接在容器內進行垂直捲動。

**Why this priority**: 桌面版空間充足，垂直排列能提供更完整的資訊概覽，且符合滑鼠捲動習慣。

**Independent Test**: 驗證桌面版 Backlog 內容超過容器高度時，會出現捲動條且內容可正常上下捲動。

**Acceptance Scenarios**:

1. **Given** 使用者在桌面版開啟 Backlog 側邊欄, **When** 使用滑鼠滾輪或捲動條, **Then** 側邊欄內的類別與任務應能正常上下捲動。

---

### Edge Cases

- **類別數量為 0 或 1**: 輪播圖應有適當的 Empty State 或隱藏切換指示。
- **任務數量極多**: 確保垂直捲動與橫向輪播在大量數據下依然保持流暢。
- **視窗縮放切換**: 在切換桌面與移動版佈局時，Backlog 的呈現方式應立即切換且保留當前瀏覽狀態。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **響應式呈現 (Responsive Presentation)**: 系統必須根據螢幕寬度自動切換 Backlog 的佈局模式（移動版：輪播，桌面版：垂直列表）。
- **FR-002**: **移動版輪播元件 (Mobile Carousel)**: 在移動版 Drawer 內，必須實作一個水平輪播容器。採用「居中露出」設計，確保當前分類卡片位於正中央且露出左右相鄰卡片邊緣。此外，系統必須在頁面生命週期內記住當前輪播的索引位置。
- **FR-003**: **桌面版垂直容器 (Desktop Vertical Container)**: 在桌面版側邊欄中，所有 Category 必須垂直排列，並在溢出時啟用容器內的 y 軸捲動。
- **FR-004**: **分類標題整合 (Category Grouping)**: Backlog 內的任務必須依據其所屬的 Category 進行分組顯示。
- **FR-005**: **Backlog 容器穩定性與精確過濾**: 系統必須依據子任務 ID 進行 1 對 1 的排程過濾。當一個子任務被加入計畫，僅該子任務在 Backlog 隱藏。父任務標題（容器）必須持續顯示，直到其下所有未完成的子任務皆已進入計畫表中。
- **FR-006**: **分類排序邏輯 (Category Sorting)**: 主頁與 Backlog 中的分類列表預設應依據「建立時間 (由新到舊)」進行排序，確保最新建立的類別出現在最前方。

### Key Entities

- **Category**: 任務的分類實體，用於分組。
- **Task**: 任務任務實體。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 移動版輪播切換的響應時間低於 100ms。
- **SC-002**: 在 10 個分類以上的情況下，桌面版垂直捲動無卡頓。
- **SC-003**: 桌面與移動版切換後的佈局更新時間低於 200ms。