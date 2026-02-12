# Tasks: Husky Git Hooks Integration

**Input**: Design documents from `/specs/001-add-husky-git-hooks/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install `husky@latest` and `lint-staged` as devDependencies, and ensure `package.json` contains appropriate lifecycle scripts (e.g. `prepare` if needed)
- [x] T002 [P] Configure `lint-staged` rules in `.lintstagedrc` for `*.{js,jsx,ts,tsx}`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Initialize Husky using `npx husky init` to create the `.husky` directory
- [x] T004 Configure the `pre-commit` hook in `.husky/pre-commit` to trigger `lint-staged` and `npm run build`

**Checkpoint**: Foundation ready - Git hooks are now capable of intercepting commits.

---

## Phase 3: User Story 1 - Commit Guard (Priority: P1) 🎯 MVP

**Goal**: Automatically run lint and build checks during git commit to ensure only valid code is committed.

**Independent Test**: Attempt to commit code with lint errors or build failures; verify that Git rejects the commit.

### Implementation for User Story 1

- [x] T005 [US1] Implement `pre-commit` script logic in `.husky/pre-commit` to exit with non-zero code on failure (FR-004, FR-005)
- [x] T006 [US1] Verify `lint-staged` correctly identifies and checks only staged files (FR-006)
- [x] T007 [US1] Ensure `npm run build` runs globally after `lint-staged` passes (FR-003)

**Checkpoint**: User Story 1 functional - The repository is now protected against invalid commits.

---

## Phase 4: User Story 2 - Automated Verification after Implementation (Priority: P2)

**Goal**: Streamline the developer workflow by automating the verification process during the commit phase.

**Independent Test**: Complete a code change and run `git commit`; observe the automated execution of the entire verification chain.

### Implementation for User Story 2

- [x] T008 [US2] Validate the integration between Git commit triggers and Husky hooks
- [x] T009 [US2] Confirm that error messages from `lint` or `build` are clearly displayed in the terminal during the commit process

**Checkpoint**: User Story 2 functional - Developers no longer need to manually run checks before committing.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T010 [P] Update `README.md` with instructions on how to bypass hooks using `--no-verify` for edge cases
- [x] T011 Run `quickstart.md` validation steps to confirm end-to-end functionality
- [x] T012 Final verification of SC-003 (Total time < 60s) on a representative staged change

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: Must run first to provide necessary tools.
2. **Foundational (Phase 2)**: Depends on tools being installed; blocks all user stories.
3. **User Stories (Phase 3-4)**: Can proceed once hooks are initialized.
4. **Polish**: Final verification.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup + Foundational.
2. Implement Phase 3 (US1).
3. **STOP and VALIDATE**: Test intercepting a bad commit.

### Incremental Delivery

1. Foundation ready.
2. Add US1 → Protected repo (MVP!).
3. Add US2 → Workflow automation.
4. Each step ensures code quality without breaking existing developer workflows.
