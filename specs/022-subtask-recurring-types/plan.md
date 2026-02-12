# Implementation Plan: SubTask Types and Recurring Logic

**Branch**: `022-subtask-recurring-types` | **Date**: 2026-02-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification for adding 'One-time', 'Multi-time', and 'Daily' subtask types with progress tracking.

## Summary
本功能旨在擴展子任務 (SubTask) 的類型，支援「一次性」、「多次性」與「每日」三種模式。技術核心在於升級 IndexedDB (Dexie) Schema，在 `SubTask` 增加類型與次數限制欄位，並在 `DailyPlanItem` 增加獨立的完成狀態 `isCompleted`，以支援重複性任務在不同日期的獨立完成進度追蹤。UI 方面將在子任務清單增加類型選擇，並在每日計畫與 Backlog 顯示進度標註（如 2/3）與循環圖示。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+  
**Primary Dependencies**: React 18+, Vite, TailwindCSS 4, Shadcn UI, Dexie.js (IndexedDB)  
**Storage**: IndexedDB (via Dexie.js) - Schema v4 Migration  
**Testing**: Vitest  
**Target Platform**: Web (PWA)
**Project Type**: Single project (Web)  
**Performance Goals**: Progress updates < 200ms (SC-002)  
**Constraints**: 100% Traditional Chinese, Offline-capable, MVP scope.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **高品質與可測試性**: ✅ 計畫包含對 Repository 與 Hook 的單元測試更新。
2. **使用者體驗一致性**: ✅ 使用現有的 Shadcn UI 組件（Select, Input, Badge）確保視覺一致。
3. **效能優先**: ✅ 使用 Dexie `useLiveQuery` 確保反應式更新，避免大範圍重新渲染。
4. **MVP 與避免過度設計**: ✅ 僅新增必要欄位，不引入複雜的排程引擎。
5. **全面正體中文**: ✅ 文件與 UI 均使用正體中文。
6. **圖像化與可視化溝通**: ✅ 計畫在 `data-model.md` 中包含實體關係說明。

## Project Structure

### Documentation (this feature)

```text
specs/022-subtask-recurring-types/
├── plan.md              # This file
├── research.md          # Research on schema migration and progress logic
├── data-model.md        # Updated Schema v4 and relationship diagram
├── quickstart.md        # Steps to verify the new recurring logic
├── contracts/           # API/UI Action contracts for type management
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── components/          # Shared UI (Checkbox, Badge, etc.)
├── features/
│   ├── daily-plan/      # DailyPlanView, PlanSubTaskItem (Update progress UI)
│   └── tasks/           # SubTaskList (Add type selection)
├── hooks/               # useSubTask, useDailyPlan (Update logic)
├── lib/                 # db.ts (Schema v4), repository.ts (CRUD logic)
└── tests/               # Unit and Integration tests
```

**Structure Decision**: 延用現有 Single Project 結構，專注於 `src/lib/db.ts` 的遷移與 `src/features` 的 UI 增強。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*無違規事項。*
