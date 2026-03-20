# Implementation Plan: Daily Plan Quick Add (UX First)

**Branch**: `027-daily-plan-quick-add` | **Date**: 2026-03-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/027-daily-plan-quick-add/spec.md`

## Summary
本計畫旨在優化「每日計劃」的新增體驗，透過整合式入口解決行動端 FAB 衝突。技術方案包含：實作一個具備交錯動畫與毛玻璃效果的 **Speed Dial** 元件（行動端），以及整合在 Backlog 邊欄頂部的**常駐輸入框**（桌機端）。同時實作具備自動降級邏輯的 Repository 輔助方法，確保在無主任務時仍能一鍵新增。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+  
**Primary Dependencies**: React 18+, Dexie.js (IndexedDB), Shadcn UI (Drawer, Select, Switch, Input), Framer Motion  
**Storage**: IndexedDB (via Dexie.js)  
**Testing**: Vitest  
**Target Platform**: Mobile Web / Desktop Web (PWA)
**Project Type**: Single project (Web)  
**Performance Goals**: Speed Dial toggle < 50ms, Task creation < 200ms.
**Constraints**: 100% Traditional Chinese, No overlapping FABs.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **高品質與可測試性**: ✅ 在 `repository.ts` 實作獨立 logic 並附帶單元測試。
2. **使用者體驗一致性**: ✅ 採用 Speed Dial 解決按鈕重疊問題，符合 UX-First 原則。
3. **效能優先**: ✅ 使用 Framer Motion 的 GPU 加速動畫與背景模糊。
4. **MVP 與避免過度設計**: ✅ 專注於核心新增與連續模式，不引入複雜的導覽邏輯。
5. **全面正體中文**: ✅ 文件、UI 與註解均使用正體中文。
6. **圖像化與可視化溝通**: ✅ 在 `research.md` 中包含 Mermaid 邏輯圖。

## Project Structure

### Documentation (this feature)

```text
specs/027-daily-plan-quick-add/
├── plan.md              # This file
├── research.md          # Speed Dial & Desktop Sidebar strategy
├── data-model.md        # Entity relationships
├── quickstart.md        # UX Verification scenarios
├── contracts/           
│   └── ui-actions.md    # Staggered animation & event states
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── features/
│   └── daily-plan/
│       ├── QuickAddTaskDrawer.tsx # Mobile Quick Add UI
│       ├── DailyPlanSpeedDial.tsx # NEW: Mobile integrated FAB
│       ├── DesktopQuickAdd.tsx    # NEW: Desktop sidebar input
│       └── DailyPlanView.tsx      # Entry point orchestration
└── lib/
    └── repository.ts              # quickCreate helper logic
```

**Structure Decision**: 延用 Feature-based 結構，將 Speed Dial 抽離為獨立組件以確保 `DailyPlanPage` 邏輯簡潔。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*無違規事項。*
