# Implementation Plan: Backlog Carousel Swipe Optimization

**Branch**: `031-backlog-swipe-optimization` | **Date**: 2026-03-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/031-backlog-swipe-optimization/spec.md`

## Summary
本計畫旨在透過將 Backlog 輪播從「手勢連動縮放」改為「分頁式自動捲動」來優化操作流暢度，並實作震動回饋的視覺調試機制以協助排查硬體相容性問題。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+  
**Primary Dependencies**: React 18+, embla-carousel-react, framer-motion, lucide-react, sonner  
**Storage**: N/A (UI-only state)  
**Testing**: Vitest  
**Target Platform**: Mobile-First Web  
**Project Type**: Single project (Web)  
**Performance Goals**: 60fps scrolling, minimal re-renders.
**Constraints**: 100% Traditional Chinese, Handle iOS haptic limitations.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **高品質與可測試性**: ✅ 包含震動邏輯的單元測試需求。
2. **使用者體驗一致性**: ✅ 使用分頁式捲動提升預測性，並提供 Debug 資訊透明化。
3. **效能優先**: ✅ 移除高頻滾動事件監聽，減少主執行緒負擔。
4. **MVP 與避免過度設計**: ✅ 專注於修復卡頓與震動失效，不引入額外複雜動效。
5. **全面正體中文**: ✅ 文件、註解與 UI 文字均維持正體中文。
6. **圖像化與可視化溝通**: ✅ 在 `research.md` 中包含事件處理流程圖。

## Project Structure

### Documentation (this feature)

```text
specs/031-backlog-swipe-optimization/
├── plan.md              # This file
├── research.md          # Paging model & Haptic debugging
├── data-model.md        # UI State & Haptic trace
├── quickstart.md        # Manual verification scenarios
├── contracts/           
│   └── ui-actions.md    # Event handlers & Debug logic
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── features/
│   └── daily-plan/
│       └── BacklogContent.tsx  # Carousel logic overhaul
└── lib/
    └── utils.ts                # Haptic utility helper
```

**Structure Decision**: 核心邏輯將集中於 `BacklogContent.tsx`，並將震動觸發邏輯抽離至 `lib/utils.ts` 以便於全域調試。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*無違規事項。*
