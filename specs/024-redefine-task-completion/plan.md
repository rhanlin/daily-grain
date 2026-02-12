# Implementation Plan: Redefine Task Completion Logic

**Branch**: `024-redefine-task-completion` | **Date**: 2026-02-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/024-redefine-task-completion/spec.md`

## Summary
本計畫旨在重新定義任務 (Task) 的「完成」邏輯，以適配 022 引入的多次性與每日子任務。核心方案是建立一個反應式的「狀態計算引擎」，根據子任務類型與累積完成度自動推導父任務狀態。技術實作將集中於 `repository.ts`，並確保手動覆寫操作能正確處理資料同步（僅同步一次性任務）與歷史進度保留（保留循環任務進度）。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+  
**Primary Dependencies**: React 18+, Dexie.js (IndexedDB)  
**Storage**: IndexedDB (via Dexie.js) - Schema v4 (from 022)  
**Testing**: Vitest  
**Target Platform**: Web (PWA)
**Project Type**: Single project (Web)  
**Performance Goals**: Status calculation < 100ms (SC-003)  
**Constraints**: 100% Traditional Chinese, Preserve recurring task history.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **高品質與可測試性**: ✅ 計畫包含對 Status Engine 的邊界案例測試。
2. **使用者體驗一致性**: ✅ 自動化狀態管理降低用戶負擔，並提供預期內的手動覆寫行為。
3. **效能優先**: ✅ 計算邏輯侷限於受影響的 Task 範圍，不進行全表掃描。
4. **MVP 與避免過度設計**: ✅ 直接利用現有的 repository 勾子觸發，不引入額外的背景 Worker。
5. **全面正體中文**: ✅ 文件與代碼註解維持正體中文。
6. **圖像化與可視化溝通**: ✅ 在 `research.md` 中以流程圖描述狀態轉換邏輯。

## Project Structure

### Documentation (this feature)

```text
specs/024-redefine-task-completion/
├── plan.md              # This file
├── research.md          # Analysis of completion rules and performance
├── data-model.md        # Logic layer definition
├── quickstart.md        # Test cases for status transitions
├── contracts/           # UI Action updates
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── features/
│   └── tasks/           # UI feedback for status changes
├── lib/
│   └── repository.ts    # Core Status Engine implementation
└── tests/               # Integration tests for status calculation
```

**Structure Decision**: 延用單一專案結構，重點修改 `src/lib/repository.ts` 的子任務同步邏輯。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*無違規事項。*
