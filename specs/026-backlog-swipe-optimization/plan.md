# Implementation Plan: Backlog Swipe Optimization

**Branch**: `026-backlog-swipe-optimization` | **Date**: 2026-03-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/026-backlog-swipe-optimization/spec.md`

## Summary
本計畫旨在透過優化 `embla-carousel-react` 的配置、實作基於捲動進度（Scroll Progress）的即時動畫、以及強化手勢鎖定機制，來徹底解決任務清單（Backlog）在行動裝置上切換分類時的卡頓感。核心技術包含使用 Embla 的事件系統與 Framer Motion 的高效能動畫組件進行 1:1 的視覺回饋。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+  
**Primary Dependencies**: React 18+, embla-carousel-react, framer-motion, lucide-react  
**Storage**: N/A (Transient UI State)  
**Testing**: Manual verification on Mobile DevTools / PWA Emulator  
**Target Platform**: Mobile (PWA priority)
**Project Type**: Single project (Web)  
**Performance Goals**: Animation frame rate > 55fps, Input Latency < 100ms.  
**Constraints**: 100% Traditional Chinese UI.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **高品質與可測試性**: ✅ 計畫包含明確的驗證場景（Quickstart），並確保手勢邏輯不影響現有的子任務操作。
2. **使用者體驗一致性**: ✅ 優化後的滑動體驗將符合行動裝置的原生系統直覺。
3. **效能優先**: ✅ 採用基於進度的動畫與 `touch-action` 優化，避免無意義的 React 重繪。
4. **MVP 與避免過度設計**: ✅ 直接在現有的 Embla 架構上進行優化，不更換核心套件。
5. **全面正體中文**: ✅ 文件與代碼註解維持正體中文。
6. **圖像化與可視化溝通**: ✅ 在 `research.md` 中詳細定義了 1:1 跟手的邏輯。

## Project Structure

### Documentation (this feature)

```text
specs/026-backlog-swipe-optimization/
├── plan.md              # This file
├── research.md          # Carousel physics and animation strategy
├── data-model.md        # Transient UI state and constraints
├── quickstart.md        # Verification Scenarios
├── contracts/           
│   └── ui-actions.md    # Carousel event definitions
└── tasks.md             # Implementation tasks (Phase 2)
```

### Source Code (repository root)

```text
src/
├── features/
│   └── daily-plan/
│       ├── BacklogContent.tsx # Carousel configuration and animation logic
│       └── CategorySlide.tsx  # Component performance optimization
└── components/
    └── ui/
        └── carousel.tsx       # Standard UI component (referenced)
```

**Structure Decision**: 延用現有的 Feature-based 結構，優化重點在於 `BacklogContent.tsx` 的邏輯重構。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*無違規事項。*
