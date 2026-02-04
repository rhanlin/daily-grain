---
description: "Backlog 過濾優化任務清單"
---

# 任務：Backlog 過濾優化

**輸入**: 來自 `/specs/008-refine-backlog-filtering/` 的設計文件
**先決條件**: plan.md (必要), spec.md (使用者故事必要), research.md, data-model.md.

**架構**: React (Vite), Dexie.js (IndexedDB), dexie-react-hooks, @dnd-kit/core.
**前端**: 反應式資料 Hook 與可拖拽 UI 組件。
**測試**: Vitest, React Testing Library。

## 第一階段：環境準備 (Setup)

**目的**: 驗證環境並為邏輯重構做準備。

- [x] T001 驗證 `package.json` 中的項目依賴 (`dexie-react-hooks`, `@dnd-kit/core`)

---

## 第二階段：基礎邏輯重構 (Foundational)

**目的**: 將核心過濾與隱藏邏輯集中在資料層。

**⚠️ 關鍵**: 在此 Hook 準確反映新資料模型前，不得進行 UI 開發。

- [x] T002 重構 `useBacklog` hook，獲取所有日期的 `DailyPlanItem` 以支援全域排程檢查 (`src/hooks/useBacklog.ts`)
- [x] T003 更新 `useBacklog`，過濾掉已完成或在「任何日期」已排程的子任務 (`src/hooks/useBacklog.ts`)
- [x] T004 在 `useBacklog` 中實作「動態任務隱藏」，移除不含任何可見子任務的父層 Task (`src/hooks/useBacklog.ts`)

**檢查點**: `useBacklog` 回傳一組乾淨的 `BacklogGroup`，確保每個 Task 至少包含一個未排程的子任務。

---

## 第三階段：使用者故事 1 - 僅子任務可排程 (Priority: P1) 🎯 MVP

**目標**: 停用 Backlog 中父層任務標題的交互功能。

**獨立測試**: 開啟 Backlog，嘗試拖拽 Task 標題。驗證其為不可交互狀態，而子任務仍可正常拖拽。

### 使用者故事 1 實作

- [x] T005 [US1] 在 `src/features/daily-plan/CategorySlide.tsx` 中將 `refType` 傳遞給 `BacklogTaskItem` 內的 `DraggableItem` 包裝器
- [x] T006 [US1] 更新 `DraggableItem` 組件，當 `refType` 為 `'TASK'` 時設定 `disabled: true` (`src/features/daily-plan/CategorySlide.tsx`)
- [x] T007 [US1] 停用行動端視圖中 Task 標題的「點擊加入」功能 (`src/features/daily-plan/CategorySlide.tsx`)

**檢查點**: Task 標題僅作為視覺錨點；排程操作僅限於子任務。

---

## 第四階段：使用者故事 2 - 自動隱藏已完全排程之任務 (Priority: P1)

**目標**: 確保 UI 能隨子任務排程狀態反應式地隱藏 Task 容器。

**獨立測試**: 將一個 Task 下的所有子任務加入每日計畫。驗證 Task 標題立即從 Backlog 中消失。

### 使用者故事 2 實作

- [x] T008 [US2] 驗證 `useBacklog` 的反應性：加入項目至計畫時，觀察 Backlog UI 是否即時更新 (`src/features/daily-plan/BacklogContent.tsx`)
- [x] T009 [P] [US2] 為重構後的 `useBacklog` hook 建立單元測試，驗證過濾邏輯 (`src/hooks/__tests__/useBacklog.test.ts`)

**檢查點**: Backlog 不再出現空的任務容器，且與每日計畫狀態保持同步。

---

## 第五階段：細節優化與跨切點關注 (Polish)

**目的**: 清理與最終驗證。

- [x] T010 審查已停用的 Task 標題樣式，確保其在視覺上與可拖拽的子任務有所區隔 (`src/features/daily-plan/CategorySlide.tsx`)
- [x] T011 驗證 Backlog 在行動端 (Carousel) 與桌面端 (Vertical List) 佈局中的視覺一致性

---

## 依賴關係與執行順序

### 階段依賴

- **環境準備 (Phase 1)**: 無依賴 - 可立即開始。
- **基礎邏輯 (Phase 2)**: 依賴 Phase 1。
- **使用者故事 1 & 2 (Phase 3 & 4)**: 皆依賴 Phase 2 的成功重構。若 T004 完成，兩者可並行實作。
- **細節優化 (Phase 5)**: 依賴所有使用者故事任務完成。

### 並行機會

- T009 (測試) 可與 T005-T007 UI 實作同步進行。
- T010 與 T011 可同時處理。

---

## 實作策略

### MVP 優先 (使用者故事 1 & 2)

1. 優先處理 `useBacklog` hook 重構 (Phase 2)，這能立即清理列表，提供最大價值。
2. 停用 Task 的拖放功能 (Phase 3)，防止進入無效狀態。
3. **驗證**: 確保將子任務加入計畫後，它會從 Backlog 移除，且當 Task 變空時會自動隱藏。

### 漸進式交付

1. 先處理資料 Hook 以確保反應性。
2. 隨後進行 `CategorySlide.tsx` 的 UI 變更，使交互與新的資料規則對齊。
