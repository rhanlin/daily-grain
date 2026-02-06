# Implementation Plan: Home Page Refactor & Terminology Update

**Branch**: `015-home-page-refactor` | **Date**: 2026-02-06 | **Spec**: [specs/015-home-page-refactor/spec.md](specs/015-home-page-refactor/spec.md)
**Input**: Feature specification from `/specs/015-home-page-refactor/spec.md`

## Summary

This feature shifts the application's primary focus to the Daily Plan by making it the root page. It also updates the project's terminology, replacing "Theme Categories" (主題分類) with "Task Management" (任務管理) to better reflect user intent. Finally, it improves the onboarding flow for new users by adding a direct link to task management when the backlog is empty.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+
**Primary Dependencies**: React 18+, React Router DOM, Shadcn UI, Framer Motion
**Storage**: N/A (UI and Routing only)
**Testing**: Manual verification of navigation and display strings.
**Target Platform**: Mobile-first Web/PWA
**Project Type**: Single project
**Performance Goals**: Instant navigation between root and management.
**Constraints**: Keep existing component and database field names (Category) to ensure stability.

## Constitution Check

*GATE: Passed.*

- **Consistent UX**: Renaming makes the app more intuitive.
- **MVP**: Focuses strictly on routing and text updates.
- **Traditional Chinese Only**: All new UI strings are TC.

## Project Structure

### Documentation (this feature)

```text
specs/015-home-page-refactor/
├── plan.md              # This file
├── research.md          # Routing & Terminology strategy
├── data-model.md        # Routing mapping table
├── quickstart.md        # Verification steps
├── contracts/           
│   └── ui-actions.md    # Action contracts for empty state
└── tasks.md             # To be generated
```

### Source Code (repository root)

```text
src/
├── App.tsx              # Router updates
├── components/
│   └── layout/
│       └── AppLayout.tsx # Navigation labels
├── pages/
│   └── HomePage.tsx     # Header text
└── features/
    ├── categories/
    │   └── CategoryOverview.tsx # Header text
    └── daily-plan/
        └── BacklogContent.tsx   # Empty state button
```

**Structure Decision**: Only UI-facing files are touched. No database or core hook logic changes.

## Complexity Tracking

No violations.