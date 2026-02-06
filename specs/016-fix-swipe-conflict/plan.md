# Implementation Plan: Fix Swipe Conflict with Overlays

**Branch**: `016-fix-swipe-conflict` | **Date**: 2026-02-06 | **Spec**: [specs/016-fix-swipe-conflict/spec.md](specs/016-fix-swipe-conflict/spec.md)
**Input**: Feature specification from `/specs/016-fix-swipe-conflict/spec.md`

## Summary

This feature resolves a user-reported bug where horizontal swipe gestures continue to trigger date changes even when an overlay (Dialog or Drawer) is active. The fix involves adding a `disabled` toggle to the `useSwipe` hook and integrating it with the overlay visibility state in `DailyPlanView.tsx`.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+
**Primary Dependencies**: React 18+, Shadcn UI, Lucide React
**Storage**: N/A (UI state only)
**Testing**: Manual verification on Mobile DevTools.
**Target Platform**: Mobile-first Web / PWA
**Project Type**: Single project
**Performance Goals**: Instant gesture blocking/unblocking.
**Constraints**: Must not affect vertical scrolling.

## Constitution Check

*GATE: Passed.*

- **High Quality & Testability**: Logic centralized in a hook.
- **Consistent UX**: Prevents accidental navigation.
- **MVP**: Targeted bug fix.
- **Traditional Chinese Only**: TC docs.

## Project Structure

### Documentation (this feature)

```text
specs/016-fix-swipe-conflict/
├── plan.md              # This file
├── research.md          # Strategy for blocking gestures
├── data-model.md        # UI state transitions
├── quickstart.md        # Verification Steps
├── contracts/           
│   └── ui-actions.md    # UI Actions & Hook updates
└── tasks.md             # To be generated
```

### Source Code (repository root)

```text
src/
├── hooks/
│   └── useSwipe.ts      # Add disabled prop support
└── features/
    └── daily-plan/
        └── DailyPlanView.tsx # Pass overlay state to hook
```

**Structure Decision**: Minimal changes to core hook and the primary view component.

## Complexity Tracking

No violations.