# Implementation Plan: Backlog Routine Filter

**Branch**: `030-backlog-routine-filter` | **Date**: 2026-03-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/030-backlog-routine-filter/spec.md`

## Summary
本計畫旨在將「隱藏每日任務」功能擴展至「每日計劃」的待辦挑選 (Backlog) 視窗中。實作重點在於於 Backlog 組件內部管理獨立的過濾狀態，確保使用者在挑選任務時能暫時精簡列表，同時符合「視窗關閉即重置」的 UX 決策。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+  
**Primary Dependencies**: React 18+, Shadcn UI (Switch, Label), Lucide React  
**Storage**: N/A (UI-only state)  
**Testing**: Vitest, React Testing Library  
**Target Platform**: Mobile-First Web  
**Project Type**: Single project (Web)  
**Performance Goals**: Filtering latency < 100ms.  
**Constraints**: 100% Traditional Chinese, Independent state from main plan view.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **高品質與可測試性**: ✅ 將實作過濾邏輯的單元測試。
2. **使用者體驗一致性**: ✅ 使用與主頁面相同的 Switch 元件與過濾邏輯。
3. **效能優先**: ✅ 過濾在前端資料投影層進行，無須額外的資料庫查詢。
4. **MVP 與避免過度設計**: ✅ 使用簡單的 `useState` 管理狀態，不引入複雜的全域 Store。
5. **全面正體中文**: ✅ 文件與 UI 標籤均維持正體中文。
6. **圖像化與可視化溝通**: ✅ 在 `research.md` 中包含過濾邏輯流圖。

## Project Structure

### Documentation (this feature)

```text
specs/030-backlog-routine-filter/
├── plan.md              # This file
├── research.md          # State management & Reset logic
├── data-model.md        # Filter projection rules
├── quickstart.md        # UX Verification scenarios
├── contracts/           
│   └── ui-actions.md    # UI event handlers
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
└── features/
    └── daily-plan/
        └── Backlog.tsx    # Main target for modification
```

**Structure Decision**: 由於 Backlog 的過濾是局部 UI 行為，所有變動將集中於 `Backlog.tsx` 或其相關聯的 UI 組件中。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*無違規事項。*
