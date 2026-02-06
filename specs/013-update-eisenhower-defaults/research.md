# Research: Update Eisenhower Defaults

**Feature**: Update Eisenhower Defaults
**Status**: Complete

## Executive Summary
This feature updates the default Eisenhower Matrix values for new Tasks and SubTasks. Tasks will now default to **Q4**, and SubTasks will inherit the Eisenhower value of their **parent Task**.

## Technical Findings

### 1. Task Creation
- **Locations identified**: 
    - `repository.tasks.create` in `src/lib/repository.ts` currently sets `eisenhower: 'Q4'`.
    - `QuickCreateTaskDrawer.tsx` in `src/features/tasks/QuickCreateTaskDrawer.tsx` currently sets `eisenhower: 'Q2'`.
- **Conflict**: The repository sets Q4 but the UI component sets Q2.
- **Decision**: Standardize both to **Q4** per FR-001.

### 2. SubTask Creation
- **Locations identified**:
    - `repository.subtasks.create` in `src/lib/repository.ts` currently hardcodes `eisenhower: 'Q4'`.
- **Inheritance Logic**: To implement inheritance, `repository.subtasks.create` needs to fetch the parent Task first.
- **Decision**: Update `repository.subtasks.create` to:
    1. Fetch parent Task using `taskId`.
    2. Default to parent's `eisenhower` value.
    3. Fallback to `Q4` if parent task data is unavailable.

### 3. Data Integrity
- The `eisenhower` field is already optional in `db.ts` (implied by fallback logic) or defaults to 'Q4'.
- Existing records will not be affected.

## Technical Decisions

### Decision: Centralize Default Logic in Repository
- **Rationale**: To ensure consistency between different UI components (e.g., drawer, batch input, imports), the logic for calculating defaults should reside in the `repository` layer rather than UI components.
- **Action**: Update `QuickCreateTaskDrawer.tsx` to use `repository.tasks.create` (if possible) or at least match the Q4 default.

### Decision: Inherited SubTask Defaults
- **Rationale**: Keeps priority alignment between parent and child.
- **Action**: Modify `src/lib/repository.ts` -> `subtasks.create` to be async and perform a lookup.

## Open Questions / Risks
- **Performance**: Fetching the parent task before every subtask creation adds a tiny DB overhead. Given IndexedDB performance, this is negligible for MVP.
- **Recursive Inheritance**: Not applicable as we only have 2 levels (Task -> SubTask).

## Plan Updates
- Update `src/lib/repository.ts` (Tasks and SubTasks creation).
- Update `src/features/tasks/QuickCreateTaskDrawer.tsx` (Task creation).
- Add unit tests for inheritance logic in `src/lib/__tests__/repository.test.ts`.
