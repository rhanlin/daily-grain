# Implementation Plan: Backlog Multi-Select (Category Scope)

**Branch**: `012-backlog-multi-select` | **Date**: 2026-02-04 | **Spec**: [specs/012-backlog-multi-select/spec.md](specs/012-backlog-multi-select/spec.md)
**Input**: Feature specification from `/specs/012-backlog-multi-select/spec.md`

## Summary

This feature adds a multi-selection mode to the Backlog Drawer, allowing users to select multiple subtasks within the **same category** (across different tasks). Users trigger the mode via a long-press. Technical implementation involves managing category-level selection state in `BacklogContent` and enforcing a "lock" on other category slides when selection is active.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+
**Primary Dependencies**: React 18+, react-use (for `useLongPress`), Lucide React, Shadcn UI
**Storage**: N/A (Transient UI State for selection); Persistent updates to `dailyPlanItems` table on confirmation.
**Testing**: Manual verification on Mobile DevTools, Unit tests for selection logic.
**Target Platform**: Mobile (PWA priority)
**Project Type**: Web Application
**Performance Goals**: Selection visual response < 100ms.
**Constraints**: Prohibition of cross-category selection (FR-002).

## Constitution Check

*GATE: Passed.*

- **High Quality & Testability**: Unit tests for selection logic added.
- **Consistent UX**: Footer follows established app patterns.
- **Performance Centric**: Pure UI state management for selection.
- **MVP**: Directly addresses category-level batch adding.
- **Traditional Chinese Only**: UI text is TC.

## Project Structure

### Documentation (this feature)

```text
specs/012-backlog-multi-select/
├── plan.md              # This file
├── research.md          # Category-level selection strategy
├── data-model.md        # UI state and selection rules
├── quickstart.md        # Verification Steps
├── contracts/           
│   └── ui-actions.md    # UI Actions & Component updates
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── features/
│   └── daily-plan/
│       ├── BacklogContent.tsx # activeCategoryId management & Global Footer
│       └── CategorySlide.tsx  # isLocked logic, selection UI, useLongPress trigger
└── hooks/
    └── useDailyPlan.ts        # Ensure batch safety
```

**Structure Decision**: Refactor of existing backlog component tree.

## Complexity Tracking

No violations.