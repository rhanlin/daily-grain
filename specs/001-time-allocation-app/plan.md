# Implementation Plan: 個人時間分配 Web App (Personal Time Allocation App)

**Branch**: `001-time-allocation-app` | **Date**: 2026-02-01 | **Spec**: [specs/001-time-allocation-app/spec.md](spec.md)
**Input**: Feature specification from `specs/001-time-allocation-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a Local-First PWA for personal time allocation using the Eisenhower Matrix and Agile principles.
**Primary Requirement**: Create a "Category -> Task -> Subtask" hierarchy where tasks are dragged to a manual-sort "Daily Plan".
**Technical Approach**:
- Frontend: React (Vite) + TypeScript + TailwindCSS v4 + Shadcn UI.
- Storage: IndexedDB (via LocalForage or similar) for offline-first capability.
- Auth: Google Sign-In (Firebase Auth or Google Identity Services).
- Testing: Vitest for unit/integration tests.
- Sync Strategy: Last-Write-Wins (Firestore or Supabase envisioned for sync, but starting with Local-First).

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js v24.13.0+ (for tooling)
**Primary Dependencies**: React 18+, Vite, TailwindCSS 4, Shadcn UI, Vitest
**Storage**: IndexedDB (Local-First), NEEDS CLARIFICATION: Backend Sync Service (Firebase/Supabase?)
**Testing**: Vitest, React Testing Library
**Target Platform**: Web (Mobile-First PWA)
**Project Type**: Single Page Application (SPA)
**Performance Goals**: < 1s load time (PWA cache), < 100ms interaction response
**Constraints**: Offline capability required, Manual sort ordering
**Scale/Scope**: Single user focus initially, 1000s of tasks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. High Quality & Testability**: Vitest selected. Logic must be testable.
- [x] **II. Consistent UX**: Shadcn UI + TailwindCSS ensures consistency.
- [x] **III. Performance Centric**: Local-First architecture guarantees low latency.
- [x] **IV. MVP & No Overdesign**: Focused on Manual Sort Daily Plan, skipping GCal sync for now.
- [x] **V. Traditional Chinese**: UI and Docs must be in Traditional Chinese.

## Project Structure

### Documentation (this feature)

```text
specs/001-time-allocation-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A for Local-First MVP?)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── assets/
├── components/          # Shadcn UI & Shared components
│   ├── ui/
│   └── ...
├── features/
│   ├── auth/            # Google Sign-In
│   ├── categories/      # Category management
│   ├── tasks/           # Task/Subtask & Matrix logic
│   └── daily-plan/      # Daily Plan & Manual Sort
├── hooks/               # Custom hooks (useTasks, useAuth)
├── lib/                 # Utilities (db, utils)
├── stores/              # State management (Zustand/Context)
└── types/               # TypeScript definitions

tests/
├── unit/
└── integration/
```

**Structure Decision**: Feature-based directory structure to keep related logic (UI, State, Types) together.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (None) | | |