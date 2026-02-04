# Research: Mobile-First Homepage Refactor

## Decision: Floating Action Button (FAB) Positioning
- **Decision**: Position the FAB at `bottom-24 right-6` (above the bottom navigation bar).
- **Rationale**: This is the "Primary Heat Zone" for right-handed thumb operation. By lifting it to `bottom-24`, we clear the standard mobile browser nav bars and our internal navigation component.
- **Alternatives considered**: Top-right corner (hard to reach), Inline button at bottom of list (scroll dependent).

## Decision: Drill-down vs. Accordion
- **Decision**: Adopt a "Drill-down" (Full-page transition) pattern for Category details.
- **Rationale**: Mobile screens lack the width for complex nested lists (Task -> Subtask) within an accordion. A full-page view provides the horizontal space necessary for readable task titles and status toggles.
- **Implementation**: Use React Router's `useNavigate` for transitions and `useParams` to fetch category data in the detail view.

## Decision: Quick-Create Task Drawer
- **Decision**: Use a bottom-drawer (Vaul/Shadcn Drawer) for task creation.
- **Rationale**: This pattern is highly familiar to mobile users. It allows for a focused, single-field entry (Title) with a "Submit" button at the bottom, which is easily accessible.
- **Feedback**: Integrate toast notifications upon success to provide immediate confirmation without blocking the UI flow.
