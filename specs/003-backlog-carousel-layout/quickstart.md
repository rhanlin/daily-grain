# Quickstart: Backlog Carousel & Scrolling Layout

## Implementation Overview
This feature refactors the `BacklogContent` into a responsive component that toggles between a horizontal carousel (Mobile) and a vertical scroll area (Desktop).

## Verification Steps

### Mobile Carousel
1.  Resize browser to < 768px.
2.  Open the Backlog drawer.
3.  Swipe left/right to navigate between categories.
4.  Verify that each slide shows only tasks from one category.

### Desktop Vertical List
1.  Resize browser to > 768px.
2.  Observe the side panel.
3.  Verify that all categories are stacked vertically.
4.  Verify that the panel scrolls vertically if content overflows.

### Unit Tests
Run `npm test` to verify `useBacklog` grouping logic.