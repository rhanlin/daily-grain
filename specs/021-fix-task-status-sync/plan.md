# Implementation Plan: Fix Task Completion Status Sync

**Branch**: `021-fix-task-status-sync` | **Date**: 2026-02-12 | **Spec**: [specs/021-fix-task-status-sync/spec.md](./spec.md)
**Input**: Feature specification from `/specs/021-fix-task-status-sync/spec.md`

## Summary

This plan addresses a bug where adding a new subtask to a DONE task fails to revert the parent task's status to TODO. We will centralize the status synchronization logic in the repository layer and enforce strict rollup rules (preventing manual DONE status if subtasks are incomplete).

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+  
**Primary Dependencies**: React 18+, Dexie.js (IndexedDB)  
**Storage**: IndexedDB (via Dexie)  
**Testing**: Vitest  
**Target Platform**: Web (PWA)
**Project Type**: Single web project  
**Performance Goals**: UI updates under 100ms  
**Constraints**: Must maintain data integrity within IndexedDB transactions.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. 高高品質與可測試性**: ✅ 將實作單元測試來驗證狀態同步與強制同步邏輯。
- **IV. MVP 與避免過度設計**: ✅ 使用現有的 Repository 模式進行修正，不引入新的框架。
- **V. 全面正體中文**: ✅ 文件與註解均使用正體中文。

## Project Structure

### Documentation (this feature)

```text
specs/021-fix-task-status-sync/
├── plan.md              # This file
├── research.md          # Updated research with strict sync logic
├── data-model.md        # Updated state transition logic (TODO/DONE)
├── quickstart.md        # Updated verification guide
├── contracts/           
│   └── repository.md    # Internal API expectations
└── tasks.md             # Implementation tasks (next step)
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── repository.ts    # Main logic change (centralizing syncParentTaskStatus + strict check)
│   └── db.ts            # Database schema
└── hooks/
    └── useSubTask.ts    # Cleanup redundant logic
```

**Structure Decision**: Single project structure as per established patterns. 

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
