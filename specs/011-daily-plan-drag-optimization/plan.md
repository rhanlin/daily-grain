# Implementation Plan: Daily Plan Drag Optimization

**Branch**: `011-daily-plan-drag-optimization` | **Date**: 2026-02-04 | **Spec**: [specs/011-daily-plan-drag-optimization/spec.md](specs/011-daily-plan-drag-optimization/spec.md)
**Input**: Feature specification from `/specs/011-daily-plan-drag-optimization/spec.md`

## Summary

This feature resolves gesture conflicts in the mobile Daily Plan view by introducing explicit Drag Handles for sorting and replacing unreliable long-press gestures with explicit `MoreHorizontal` menu buttons. It also fixes critical logic conflicts between "Matrix Sorting" and manual reordering.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+
**Primary Dependencies**: React 18+, dnd-kit, Lucide React, TailwindCSS 4, Shadcn UI
**Storage**: IndexedDB (via Dexie.js) - existing schema sufficient
**Testing**: npm test (Vitest), Manual verification on mobile DevTools
**Target Platform**: Mobile Web (PWA)
**Project Type**: Web Application
**Performance Goals**: Start-to-drag latency < 150ms
**Constraints**: 
- Removal of all `useLongPress` hooks to prevent conflicts.
- Disable manual dragging when `sortByMatrix` is enabled (FR-006).
- Ensure `SortableContext` uses the `'daily-plan'` container ID (FR-007).

## Constitution Check

*GATE: Passed. Re-check after Phase 1 design.*

- **High Quality & Testability**: Refactor ensures clearer event handling and stable container IDs.
- **Consistent UX**: Global removal of long-press in favor of buttons (SC-004).
- **Performance Centric**: Optimized `TouchSensor` config.
- **MVP**: Resolves reordering failures and gesture friction reported by user.
- **Traditional Chinese Only**: All UI text stays TC.

## Project Structure

### Documentation (this feature)

```text
specs/011-daily-plan-drag-optimization/
├── plan.md              # This file
├── research.md          # Gesture isolation & Conflict analysis
├── data-model.md        # Sensor Config
├── quickstart.md        # Verification Steps
├── contracts/           
│   └── ui-actions.md    # UI Actions & Component requirements
└── tasks.md             # Updated tasks
```

### Source Code (repository root)

```text
src/
├── pages/
│   └── DailyPlanPage.tsx # Sensor calibration & Drag event handling
├── components/
│   └── dnd/
│       └── DraggableTask.tsx # Add DragHandle, conditional dragging
├── features/
│   ├── daily-plan/
│   │   └── DailyPlanView.tsx # Container ID alignment & Matrix sort logic
│   └── tasks/
│       ├── TaskItem.tsx    # Responsive menu visibility
│       └── SubTaskList.tsx # Consistent menu trigger
```

**Structure Decision**: Component-level refactor focusing on event propagation and sorting stability.

## Complexity Tracking

No violations.