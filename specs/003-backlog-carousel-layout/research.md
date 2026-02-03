# Research: Backlog Carousel & Scrolling Layout

## Decision: Use `embla-carousel-react` for Mobile Carousel
- **Decision**: Adopt the standard Shadcn UI Carousel (based on `embla-carousel-react`).
- **Rationale**: Lightweight, performant, native touch support. Aligns with mobile-first gesture requirements.
- **Alternatives considered**: `framer-motion` (overkill), `react-slick` (jQuery/outdated).

## Decision: Refactor Backlog Logic into `useBacklog` Hook
- **Decision**: Centralize data grouping/filtering logic.
- **Rationale**: Separates data transformation from presentation. Enables easier testing of grouping logic.
- **Implementation Note**: Uses `useLiveQuery` to stay in sync with IndexedDB.

## Decision: Maintain Active Index on Resize
- **Decision**: Track the active category index in the `BacklogContent` component.
- **Rationale**: Ensures that resizing the window from mobile to desktop and back doesn't lose the user's current category focus.