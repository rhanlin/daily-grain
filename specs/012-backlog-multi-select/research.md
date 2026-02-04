# Research: Backlog Multi-Select (Category-Level Selection)

**Feature**: Backlog Multi-Select
**Status**: Complete

## Executive Summary
The goal is to allow users to multi-select any subtasks within the **same category** (Carousel slide) while prohibiting cross-category selection. The mode is triggered by a long-press on a subtask.

## Technical Decisions

### 1. State Management (Category Scope)
- **Decision**: Track `activeCategoryId` instead of `activeParentTaskId`.
- **Rationale**: The user corrected the requirement to allow selecting multiple subtasks across different tasks, as long as they are in the same category.
- **Implementation**: 
  - `activeCategoryId: string | null`
  - `selectedIds: Set<string>`

### 2. Slide Locking (Cross-Category)
- **Decision**: Implement a conditional "Locked" state for `CategorySlide`.
- **Rationale**: Compliance with FR-003. If `isSelectionMode` is true and the current slide's `category.id` !== `activeCategoryId`, the slide should be visually dimmed and non-interactive.
- **Visuals**: `opacity-30 grayscale pointer-events-none`.

### 3. Persistent Footer
- **Decision**: Keep the floating action bar in `BacklogContent` fixed.
- **Rationale**: Since the carousel slides horizontally, the footer should remain stable at the bottom of the drawer container to allow the user to click "Add" from any slide once they've made their selection in the "active" slide.

### 4. Integration with Carousel
- **Decision**: The carousel `select` event already tracks `activeIndex`. We can map `groups[activeIndex - 1].category.id` to determine if the user has navigated away from the active selection slide.
- **Alternative**: Simply check the `category.id` passed to each `CategorySlide` component. If it doesn't match `activeCategoryId`, lock it. This is more declarative and less dependent on carousel internal state.

## Open Questions / Risks
- **Risk**: User selects items in Category A, slides to Category B (which is now locked), then forgets where they selected items.
- **Mitigation**: Choice B from clarification (keeping the selection but locking other slides) is confirmed. The footer count `加入今日計畫 (N)` helps remind the user that a selection is active.

## Plan Updates
- Update `BacklogContent.tsx` to manage `activeCategoryId`.
- Refactor `CategorySlide.tsx` to accept and enforce category-level selection logic.