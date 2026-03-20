# Implementation Plan: Restore Archive Management

**Branch**: `029-restore-archive-management` | **Date**: 2026-03-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/029-restore-archive-management/spec.md`

## Summary
本計畫旨在恢復並優化「封存」功能。技術方案包含：將資料庫升級至版本 6 以支援子任務封存狀態、在「任務管理」側邊欄加入管理入口、建立具備「還原」與「永久刪除」功能的獨立管理頁面，並確保全系統一致地過濾已封存資料。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+  
**Primary Dependencies**: React 18+, Dexie.js (IndexedDB), Shadcn UI, Framer Motion  
**Storage**: IndexedDB (Schema v6)  
**Testing**: Vitest  
**Target Platform**: Mobile Web / PWA  
**Project Type**: Single project (Web)  
**Performance Goals**: UI Response < 100ms, Batch deletion < 500ms.  
**Constraints**: 100% Traditional Chinese, Handle recursive archival (Category -> Task).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **高品質與可測試性**: ✅ 將在 `repository.ts` 實作封存邏輯並附帶單元測試。
2. **使用者體驗一致性**: ✅ 採用與系統其他部分一致的 Shadcn UI 與 Framer Motion 動效。
3. **效能優先**: ✅ 在資料庫層級進行過濾，避免拉取過多無效資料。
4. **MVP 與避免過度設計**: ✅ 專注於核心的封存/還原流程，不引入複雜的定時清理功能。
5. **全面正體中文**: ✅ 文檔、註解與介面文字均維持正體中文。
6. **圖像化與可視化溝通**: ✅ 在 `research.md` 中包含封存狀態聯動的流程圖。

## Project Structure

### Documentation (this feature)

```text
specs/029-restore-archive-management/
├── plan.md              # This file
├── research.md          # Schema v6 & Entry point decisions
├── data-model.md        # SubTask schema update & Visibility rules
├── quickstart.md        # Manual verification steps
├── contracts/           
│   └── ui-actions.md    # Archival logic & Restore handlers
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── features/
│   ├── archive/         # NEW: Archive management UI
│   ├── tasks/           # Entry point additions (TaskItem, SubTaskList)
│   └── daily-plan/      # Visibility check updates
├── hooks/               # useArchive hook
└── lib/
    ├── db.ts            # Schema v6 Migration
    └── repository.ts    # Archive/Restore implementations
```

**Structure Decision**: 建立獨立的 `features/archive/` 目錄管理封存視圖，並優化 `repository.ts` 以支持子任務封存。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*無違規事項。*
