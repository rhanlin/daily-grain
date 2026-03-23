# Tasks: Backlog Carousel Swipe Optimization (待辦清單輪播滑動優化)

**Input**: Design documents from `/specs/031-backlog-swipe-optimization/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-actions.md

## Phase 1: Setup

**Purpose**: Verify and prepare project infrastructure

- [x] T001 [P] Verify `embla-carousel-react`, `framer-motion`, and `sonner` usage in `package.json`

---

## Phase 2: Foundational

**Purpose**: Core utilities for haptics

- [x] T002 Implement `triggerHaptic` utility function in `src/lib/utils.ts` with support for `navigator.vibrate` and optional debug toasts

---

## Phase 3: User Story 1 - 絲滑的輪播滑動體驗 (Priority: P1) 🎯 MVP

**Goal**: Transform the carousel from linked-motion to a paging-based model for better performance and predictability.

**Independent Test**: Swipe through the Backlog categories and verify that cards snap cleanly to the center without continuous scaling mid-gesture.

### Implementation for User Story 1

- [x] T003 [US1] Remove high-frequency `scroll` event listeners and `MotionValue` updates in `src/features/daily-plan/BacklogContent.tsx`
- [x] T004 [US1] Configure Embla Carousel `opts` with `containScroll: 'trimSnaps'` and optimized `duration` in `src/features/daily-plan/BacklogContent.tsx`
- [x] T005 [US1] Refactor `AnimatedCarouselItem` in `src/features/daily-plan/BacklogContent.tsx` to use discrete state-based styling (active/inactive) instead of scroll-linked transforms

**Checkpoint**: User Story 1 functional - Carousel follows a clean paging model with high performance.

---

## Phase 4: User Story 2 - 可感知的震動回饋 (Priority: P1)

**Goal**: Restore tactile feedback and provide visual debug signals for non-supporting browsers (like iOS Safari).

**Independent Test**: Swipe to a new category on an Android device and feel the vibration; verify a debug Toast appears if debug mode is enabled.

### Implementation for User Story 2

- [x] T006 [US2] Implement `select` event handler in `BacklogContent.tsx` to trigger `triggerHaptic(20)` on successful snaps
- [x] T007 [US2] Integrate a developer-toggleable debug mode in `BacklogContent.tsx` to display visual Toasts for haptic triggers
- [x] T008 [US2] Refine initial snap logic and placeholder (Index 0) bounce-back in `BacklogContent.tsx` to prevent redundant vibrations

**Checkpoint**: User Story 2 functional - Haptics are reliable and debuggable across all mobile platforms.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and quality audit

- [x] T009 Perform manual verification of all scenarios in `specs/031-backlog-swipe-optimization/quickstart.md`
- [x] T010 [P] Performance Audit: Use Chrome DevTools to verify stable 60fps scrolling and minimal re-renders
- [x] T011 [P] Strict type audit: Ensure 100% type safety in `BacklogContent.tsx` and `utils.ts` per Principle I
- [x] T012 Final build check: `npm run build`

---

## Dependencies & Execution Order

1. **Phase 2** must be completed before Story 2.
2. **User Story 1 (Phase 3)** is the primary architectural change and should be completed first.
3. **User Story 2 (Phase 4)** adds haptic enhancement.
4. **Phase 5** ensures overall quality.

## Parallel Execution Examples

- **Foundational & UI**: T002 (Utils) and T003 (UI Cleanup) can start simultaneously.
- **Audit**: T010 and T011 can be performed in parallel after implementation.

## Implementation Strategy

### MVP First
1. Complete T003 and T004 to fix the "laggy" feel by moving to paging.
2. Implement T002 and T006 to restore basic vibration functionality.
3. Validate on an Android device.

### Debug First (for iOS)
1. Implement T007 (Debug Toasts) immediately after T002 to facilitate testing on iPhone devices where vibration is unavailable.
