# Implementation Plan: Daily Plan Gestures & Filters (UX Optimized)

**Branch**: `028-move-subtask-filter-daily` | **Date**: 2026-03-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/028-move-subtask-filter-daily/spec.md`

## Summary
本計畫旨在優化「每日計劃」的規劃體驗。核心包含：實作「兩側引導面板 (Side Guide Panels)」解決拖曳移動日期的發現性問題；以及實作具備「虛擬索引對映」功能的例行性任務過濾器，確保在部分項目隱藏的情況下仍能進行精確的排序持久化。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+  
**Primary Dependencies**: React 18+, dnd-kit, Framer Motion, Dexie.js (IndexedDB)  
**Storage**: IndexedDB (via Dexie.js)  
**Testing**: Vitest, React Testing Library  
**Target Platform**: Mobile-First Web (PWA)
**Project Type**: Single project (Web)  
**Performance Goals**: UI response < 100ms, Date shift hover trigger: 500ms.
**Constraints**: 100% Traditional Chinese, Preserve absolute positions of hidden items during reorder.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **高品質與可測試性**: ✅ 計畫包含針對「過濾排序演算法」的單元測試需求。
2. **使用者體驗一致性**: ✅ 採用「邊緣引導面板」提升功能發現性，符合當代行動端手勢標準。
3. **效能優先**: ✅ 過濾邏輯在 UI 層執行，排序更新採用批量事務處理。
4. **MVP 與避免過度設計**: ✅ 利用現有的 Dnd 基礎架構，僅新增必要的視覺引導層。
5. **全面正體中文**: ✅ 文件、UI 與註解均維持正體中文。
6. **圖像化與可視化溝通**: ✅ 在 `research.md` 中包含手勢觸發的邏輯流程圖。

## Project Structure

### Documentation (this feature)

```text
specs/028-move-subtask-filter-daily/
├── plan.md              # This file
├── research.md          # Side Guide Panels & Hover logic
├── data-model.md        # Reorder algorithm for filtered sets
├── quickstart.md        # UX Verification scenarios
├── contracts/           
│   └── ui-actions.md    # Dnd event contracts
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── features/
│   └── daily-plan/
│       ├── DailyPlanView.tsx    # Main coordination & Filter state
│       ├── PlanToolbar.tsx      # Filter switch
│       ├── SideGuidePanels.tsx  # NEW: Droppable edge targets
│       └── DragLogic.ts         # Reorder logic update
└── lib/
    └── repository.ts            # Atomic date move implementation
```

**Structure Decision**: 延用 Feature-based 結構，將引導面板抽離為獨立組件以保持 `DailyPlanView` 的簡潔。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*無違規事項。*
