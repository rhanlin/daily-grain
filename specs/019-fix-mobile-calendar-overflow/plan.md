# Implementation Plan: Fix Mobile Calendar Drawer Overflow

**Branch**: `019-fix-mobile-calendar-overflow` | **Date**: 2026-02-08 | **Spec**: [specs/019-fix-mobile-calendar-overflow/spec.md](spec.md)
**Input**: Feature specification from `specs/019-fix-mobile-calendar-overflow/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature resolves a UI layout bug where the Calendar component overflows its Drawer container on mobile devices. The fix involves optimizing the responsive layout of `DailyPlanDateSelector`, enforcing max-width constraints, and ensuring safe-area compliance for the Drawer content.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+
**Primary Dependencies**: React 18+, TailwindCSS 4, Shadcn UI (Drawer), Lucide React
**Storage**: N/A (UI Layout Fix)
**Testing**: Vitest (Unit), Manual Mobile Testing (Layout)
**Target Platform**: Mobile Web (PWA)
**Project Type**: Web Application (React + Vite)
**Performance Goals**: N/A (Layout Fix)
**Constraints**: Must support small mobile viewports (e.g., iPhone SE) and handle Safe Area insets properly.
**Scale/Scope**: Single component fix (`DailyPlanDateSelector` and `Calendar` styling).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. High Quality & Testability**: Fix must be verified on actual mobile simulation.
- **II. Consistent UX**: Drawer behavior matches other parts of the app.
- **III. Performance Centric**: CSS-only fix preferred; no JS overhead.
- **IV. MVP & No Overdesign**: Fix only the overflow issue; do not refactor the entire calendar logic.
- **V. Traditional Chinese Only**: N/A (Code changes only).
- **VI. Visual Documentation**: N/A (Bug fix).

## Project Structure

### Documentation (this feature)

```text
specs/019-fix-mobile-calendar-overflow/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── components/
│   └── ui/
│       └── calendar.tsx            # (Possible update) styling adjustments
└── features/
    └── daily-plan/
        └── DailyPlanDateSelector.tsx # (Primary fix) Drawer layout container
```

**Structure Decision**: Modify existing components in-place. No new files required.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |
