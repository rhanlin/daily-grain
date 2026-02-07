# Implementation Plan: Task UI Refinement

**Branch**: `017-task-ui-refinement` | **Date**: 2026-02-06 | **Spec**: [specs/017-task-ui-refinement/spec.md](specs/017-task-ui-refinement/spec.md)
**Input**: Feature specification from `/specs/017-task-ui-refinement/spec.md`

## Summary

This feature refines the Eisenhower Matrix view by defaulting to Task-level visibility and overhauls the Task Management UI. Key updates include square category cards in a 2-column mobile layout, persistent reordering via DnD, and mobile gesture optimizations (TouchSensor tuning and `touch-action` blocking) to resolve background displacement bugs.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+
**Primary Dependencies**: React 18+, dnd-kit, Tailwind CSS 4, Dexie.js
**Storage**: IndexedDB (Categories table v3 with `orderIndex`)
**Testing**: Manual verification on mobile emulation; Unit tests for migration and sort logic.
**Target Platform**: Mobile-first Web / PWA
**Performance Goals**: DnD response time < 50ms; Fluid layout transitions.
**Constraints**: Block native browser scrolling during DnD via `touch-action: none`.

## Constitution Check

*GATE: Passed.*

- **High Quality & Testability**: Centralized sorting logic in repository with automated tests.
- **Consistent UX**: Aligns mobile DnD parameters (150ms delay) with Daily Plan.
- **MVP**: Targeted UI improvements and specific bug fix for mobile reordering.
- **Traditional Chinese Only**: UI text remains TC.

## Project Structure

### Documentation (this feature)

```text
specs/017-task-ui-refinement/
├── plan.md              # This file
├── research.md          # Layout & Mobile DnD optimization strategy
├── data-model.md        # DB Schema v3 details
├── quickstart.md        # Verification Steps
├── contracts/           
│   └── ui-actions.md    # Sensor parameters & DnD contracts
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── db.ts            # Migration to v3
│   └── repository.ts    # Category sort methods
├── features/
│   └── categories/
│       ├── CategoryOverview.tsx # DnD Context (TouchSensor logic)
│       └── CategoryCard.tsx     # Square layout & touch-action style
└── pages/
    └── MatrixPage.tsx   # Default filter update
```

**Structure Decision**: Integrated DnD into `CategoryOverview`. Mobile-specific fixes (TouchSensor tuning) are applied at the context level.

## Complexity Tracking

No violations.