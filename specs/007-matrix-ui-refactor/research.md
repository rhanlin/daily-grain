# Research: Eisenhower Matrix UI Refactor

## Decision: Fixed-Height 2x2 Grid
- **Decision**: Implement the matrix using a CSS Grid with `grid-template-columns: 1fr 1fr` and `grid-template-rows: 1fr 1fr`. The container will have a fixed height (e.g., `calc(100vh - 200px)` or `80vh`) to prevent vertical stretching.
- **Rationale**: This ensures the matrix remains a perfect 2x2 square/rectangle, satisfying the "Quadrant" visual requirement. It forces individual quadrants to handle their own overflow via scrolling.
- **Alternatives considered**: Flexbox wrap (unstable row alignment), absolute positioning (hard to manage responsiveness).

## Decision: Axis Label Positioning
- **Decision**: Place the Y-axis label (Importance) vertically to the left of the grid and the X-axis label (Urgency) horizontally below the grid.
- **Rationale**: Matches the standard mathematical quadrant representation. Using external labels keeps the content area of the quadrants clean.
- **Implementation**: Use CSS `writing-mode: vertical-lr` for the Y-axis label to save horizontal space on mobile.

## Decision: High-Density UI via Header Removal
- **Decision**: Remove the page-level title and description from `MatrixPage.tsx`.
- **Rationale**: In a utility-focused productivity tool, users know which page they are on via the icon/navigation. Removing static headers grants an additional ~100px of vertical space, crucial for fitting the 2x2 grid on mobile screens.

## Decision: FAB-based View Filter
- **Decision**: Replace the static `Tabs` component with a `DropdownMenu` triggered by a Floating Action Button (FAB).
- **Rationale**: Static tabs consume permanent vertical space. Moving this function to a FAB keeps the top area clear for the axis labels and the grid itself.

## Decision: Compact Axis Labels
- **Decision**: Reduce the padding of the Y-axis (Importance) and X-axis (Urgency) to zero relative to the grid borders.
- **Rationale**: Maximizes the internal area available for Task items. Using a tight alignment creates a more professional "Blueprint" or "Dashboard" aesthetic.

