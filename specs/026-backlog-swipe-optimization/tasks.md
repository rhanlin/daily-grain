# Tasks: Backlog Swipe Optimization

**Input**: Design documents from `/specs/026-backlog-swipe-optimization/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-actions.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Component refinement and performance preparation

- [x] T001 [P] Optimize `src/features/daily-plan/CategorySlide.tsx` using `React.memo` to prevent unnecessary re-renders during high-frequency scroll events
- [x] T002 [P] Apply `touch-action: pan-y` to the carousel container and items in `src/features/daily-plan/BacklogContent.tsx` to implement basic directional locking (FR-003)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Embla animation and event integration

- [x] T003 Integrate `onScroll` event listener in `src/features/daily-plan/BacklogContent.tsx` to track `scrollProgress` in real-time
- [x] T004 Implement progress-based animation logic in `src/features/daily-plan/BacklogContent.tsx` using Framer Motion's `useMotionValue` to map scroll distance to scale/opacity (FR-002)

**Checkpoint**: 1:1 Tracking ready - The UI now responds directly to finger movement rather than just snapping.

---

## Phase 3: User Story 1 - 絲滑的分類切換 (Priority: P1) 🎯 MVP

**Goal**: Deliver 60fps chronological slide transitions with 1:1 finger tracking.

**Independent Test**: Drag the backlog carousel slowly and verify that adjacent slides transform smoothly in proportion to the drag distance (SC-001).

### Implementation for User Story 1

- [x] T005 [US1] Refactor `motion.div` in `src/features/daily-plan/BacklogContent.tsx` to consume real-time motion values instead of discrete state indexes
- [x] T006 [US1] Fine-tune Embla options (e.g., `duration`, `containScroll`) in `src/features/daily-plan/BacklogContent.tsx` to achieve optimal "physics" feel (SC-003)

**Checkpoint**: US1 functional - Backlog switching feels significantly more responsive and "alive".

---

## Phase 4: User Story 2 - 手勢衝突處理與質感提升 (Priority: P2)

**Goal**: Ensure scroll axis isolation and provide tactile confirmation.

**Independent Test**: Perform horizontal swipes on long lists without triggering vertical movement (SC-002); verify subtle vibration on snap (SC-003).

### Implementation for User Story 2

- [x] T007 [US2] Implement `navigator.vibrate(10)` trigger inside the Embla `select` event handler in `src/features/daily-plan/BacklogContent.tsx`
- [x] T008 [US2] Verify and adjust `touch-action` and pointer event bubbling in `src/features/daily-plan/CategorySlide.tsx` to ensure `DraggableItem` does not interfere with carousel swiping

**Checkpoint**: US2 functional - Navigation is accurate and provides premium tactile feedback.

---

## Phase 5: User Story 3 - 邊緣回彈與視覺引導 (Priority: P3)

**Goal**: Polish boundaries with elastic behavior.

**Independent Test**: Swipe past the first/last slide and verify the "rubber-band" visual effect (SC-004).

### Implementation for User Story 3

- [x] T009 [US3] Ensure Embla's default resistance logic is correctly mapped to the custom progress animations in `src/features/daily-plan/BacklogContent.tsx`
- [x] T010 [US3] Add visual cues or subtle overflow indicators at boundaries if the default bounce is insufficient for user feedback (Default bounce is sufficient with Embla)
- [x] T010b [US3] Implement or verify debouncing/interruption logic for rapid consecutive swipes to prevent animation flickering or state desync in `src/features/daily-plan/BacklogContent.tsx` (Handled natively by Embla + useMotionValue)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and performance audit

- [x] T011 Perform manual verification of all scenarios in `specs/026-backlog-swipe-optimization/quickstart.md`
- [x] T012 Conduct a performance audit using Chrome DevTools (Rendering tab) to ensure SC-001 (>55fps) is met
- [x] T013 Final build check: `npm run build`

---

## Dependencies & Execution Order

1. **Phase 1 & 2** are strictly required before any User Story work.
2. **Phase 3 (US1)** is the primary goal and MUST be completed before Phase 4/5.
3. **Phase 4 & 5** can be implemented in parallel once the base animation engine is stable.

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Foundational animation logic.
2. Implement 1:1 Tracking in US1.
3. **STOP and VALIDATE**: Verify the "絲滑" feel on a real mobile device or simulator.

### Incremental Delivery
1. Add US2 (Haptics & Locking) to improve precision.
2. Add US3 (Boundary Bounce) for final polish.
