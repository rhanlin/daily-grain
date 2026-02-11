# Implementation Plan: Task/Sub-task Cleanup Sync

**Branch**: `020-fix-cleanup-subtasks` | **Date**: 2026-02-11 | **Spec**: [specs/020-fix-cleanup-subtasks/spec.md](spec.md)
**Input**: Feature specification for fixing orphaned sub-tasks after Task deletion/archival.

## Summary
The goal is to ensure data integrity and a clean UI by implementing cascading deletes for Task removal and improved query filtering for Task archival. We will modify the repository layer to handle transactions and update hooks to account for parent Task status.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18+
**Primary Dependencies**: Dexie.js, dexie-react-hooks
**Storage**: IndexedDB (via Dexie)
**Testing**: Vitest
**Project Type**: Single-page Web App (React)
**Constraints**: Must handle concurrent deletions and ensure no broken references in the Daily Plan.

## Constitution Check

*GATE: Passed Phase 0 research. Re-checking after Phase 1 design.*

- **High Quality & Testability**: ✅ Logic will be centralized in `repository.ts` and covered by unit tests.
- **MVP & No Overdesign**: ✅ We are using existing status fields and standard Dexie transactions without adding heavy middleware.
- **Traditional Chinese Only**: ✅ All documentation and comments follow the rule.
- **Visual Documentation**: ✅ Data relationships documented in `data-model.md`.

## Project Structure

### Documentation (this feature)

```text
specs/020-fix-cleanup-subtasks/
├── plan.md              # This file
├── research.md          # Research on Dexie transactions and query filtering
├── data-model.md        # Cascading behavior and visibility logic
├── quickstart.md        # Manual verification steps
└── tasks.md             # (To be generated)
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── db.ts            # Database schema
│   ├── repository.ts    # Implementation of deleteTask cascade
├── hooks/
│   ├── useBacklog.ts    # Filter out sub-tasks of archived tasks
│   ├── useSubTask.ts    # Update filtering logic
│   ├── useDailyPlan.ts  # Ensure scheduled items are cleaned up
```

**Structure Decision**: We will stick to the existing structure, primarily focusing on `src/lib/repository.ts` for data mutation and `src/hooks/` for data retrieval logic.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |