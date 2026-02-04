# Implementation Plan: Daily Plan Drag Optimization

**Branch**: `011-daily-plan-drag-optimization` | **Date**: 2026-02-04 | **Spec**: [specs/011-daily-plan-drag-optimization/spec.md](specs/011-daily-plan-drag-optimization/spec.md)
**Input**: Feature specification from `/specs/011-daily-plan-drag-optimization/spec.md`

## Summary

This feature resolves gesture and logic conflicts in the Daily Plan view. Technical approach involves migrating from global long-press gestures to explicit `MoreHorizontal` menu buttons, implementing strict drag-handles for sorting, and adding conflict logic to disable manual reordering when automated matrix sorting is enabled.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+
**Primary Dependencies**: React 18+, dnd-kit, Lucide React, TailwindCSS 4, Shadcn UI
**Storage**: IndexedDB (via Dexie.js) - Schema migration required (add `createdAt` to Task and SubTask for stable sorting).
**Testing**: npm test (Vitest), Manual verification on mobile DevTools
**Target Platform**: Mobile Web (PWA focus)
**Project Type**: Web Application
**Performance Goals**: Start-to-drag latency < 150ms, 60fps animations
**Constraints**: Global removal of `useLongPress` to prevent conflicts
**Scale/Scope**: Refactoring task cards in Daily Plan and Task lists.

## Constitution Check

*GATE: Passed.*

- **High Quality & Testability**: Refactor ensures clearer event handling and stable container IDs.
- **Consistent UX**: Global removal of long-press in favor of buttons (Consistent UX Principle).
- **Performance Centric**: Optimized `TouchSensor` config.
- **MVP**: Resolves the direct friction reported by user.
- **Traditional Chinese Only**: All UI text stays TC.

## Project Structure

### Documentation (this feature)

```text
specs/011-daily-plan-drag-optimization/
├── plan.md              # This file
├── research.md          # Conflict analysis & Resolution decisions
├── data-model.md        # Sensor Config & State Logic
├── quickstart.md        # Verification Steps
├── contracts/           # UI Actions & Context synchronization
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── components/
│   └── dnd/
│       └── DraggableTask.tsx # Add DragHandle, conditional dragging
├── features/
│   ├── daily-plan/
│   │   └── DailyPlanView.tsx # Matrix sort logic, Container ID alignment
│   └── tasks/
│       ├── TaskItem.tsx    # Responsive menu visibility, remove useLongPress
│       └── SubTaskList.tsx # Consistent menu trigger, remove useLongPress
└── pages/
    └── DailyPlanPage.tsx # Sensor calibration (activationConstraint)
```

**Structure Decision**: Component-level refactor of existing Daily Plan and Task features.

## Complexity Tracking

No violations.