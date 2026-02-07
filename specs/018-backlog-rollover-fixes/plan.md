# Implementation Plan: Backlog and Rollover Fixes

**Branch**: `018-backlog-rollover-fixes` | **Date**: 2026-02-06 | **Spec**: [specs/018-backlog-rollover-fixes/spec.md](specs/018-backlog-rollover-fixes/spec.md)
**Input**: Feature specification from `/specs/018-backlog-rollover-fixes/spec.md`

## Summary

This feature fixes critical UX and data integrity issues. It resolves the UI overlap in the Backlog Drawer, separates scroll and selection gestures in multi-select mode, and fixes the rollover logic to ensure all uncompleted tasks transition correctly to the next day.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+
**Primary Dependencies**: React 18+, Dexie.js (IndexedDB), Tailwind CSS 4, Shadcn UI
**Storage**: IndexedDB (Updates `dailyPlanItems`)
**Testing**: Manual verification on mobile emulation; Unit tests for rollover batch logic.
**Target Platform**: Mobile-first Web / PWA
**Project Type**: Single project
**Performance Goals**: Rollover processing for 50 items < 100ms.
**Constraints**: Must ensure transaction safety for rollover logic.

## Constitution Check

*GATE: Passed.*

- **High Quality & Testability**: Rollover logic will be tested for batch success.
- **Consistent UX**: Fixes occlusion and interaction conflicts.
- **MVP**: Directly addresses bug reports.
- **Traditional Chinese Only**: TC text in UI and documentation.

## Project Structure

### Documentation (this feature)

```text
specs/018-backlog-rollover-fixes/
├── plan.md              # This file
├── research.md          # Gesture & CSS strategy
├── data-model.md        # Transaction & Logic rules
├── quickstart.md        # Verification Steps
├── contracts/           
│   └── ui-actions.md    # UI Actions & Service updates
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── rollover.ts      # Fix batch rollover loop
│   └── __tests__/
│       └── rollover.test.ts # New batch tests
└── features/
    └── daily-plan/
        ├── BacklogContent.tsx # Add padding & gesture lock
        └── CategorySlide.tsx  # Implement tap-vs-scroll check
```

**Structure Decision**: Integrated fixes into existing components and services. No new architectural layers.

## Complexity Tracking

No violations.