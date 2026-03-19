# Implementation Plan: SubTask Chronic Ordering

**Branch**: `025-subtask-ordering` | **Date**: 2026-03-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/025-subtask-ordering/spec.md`

## Summary
本計畫旨在修復子任務 (SubTask) 在各視圖中排序隨機的問題。技術方案是將資料庫主鍵 (UUID) 的隨機排序改為以「創建時間 (createdAt)」為主的穩定排序，並確保在待辦清單 (Backlog) 中維持「按任務分組」且「組內按時間排序」的邏輯。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+  
**Primary Dependencies**: React 18+, Dexie.js (IndexedDB)  
**Storage**: IndexedDB (via Dexie.js)  
**Testing**: Vitest  
**Target Platform**: PWA / Mobile Web
**Project Type**: Single project (Web)  
**Performance Goals**: UI Response < 100ms, Sorting < 50ms.
**Constraints**: 100% Traditional Chinese, Preserve recurring task history.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **高品質與可測試性**: ✅ 本功能簡單，邏輯集中在 repository 與 hook 層，易於編寫單元測試。
2. **使用者體驗一致性**: ✅ 全域統一的排序規則（由舊到新）符合直覺。
3. **效能優先**: ✅ 在 IndexedDB 層使用 `orderBy` 並在 UI 層進行少量的內存排序，效能開銷極低。
4. **MVP 與避免過度設計**: ✅ 直接利用現有的 `createdAt` 欄位，不增加額外的複雜度。
5. **全面正體中文**: ✅ 文檔、註解與變數命名維持正體中文。
6. **圖像化與可視化溝通**: ✅ 在 `research.md` 中詳細說明了排序回退邏輯。

## Project Structure

### Documentation (this feature)

```text
specs/025-subtask-ordering/
├── plan.md              # This file
├── research.md          # Dual-Level Sorting Strategy
├── data-model.md        # SubTask Sorting Algorithm
├── quickstart.md        # Verification Steps
├── contracts/           
│   └── ui-actions.md    # UI Actions & Component updates
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── features/
│   ├── tasks/           # EisenhowerMatrix.tsx
│   └── daily-plan/      # CategorySlide.tsx (if needed)
├── hooks/
│   └── useBacklog.ts    # Group-by logic
└── lib/
    └── repository.ts    # subtasks.getByTask implementation
```

**Structure Decision**: 延用單一專案結構，重點修改 `src/lib/repository.ts`, `src/features/tasks/EisenhowerMatrix.tsx`, `src/hooks/useBacklog.ts`。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*無違規事項。*
