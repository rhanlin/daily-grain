# p-note Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-02

## Active Technologies
- TypeScript 5.x, Node.js v24.13.0+ (for tooling) + React 18+, Vite, TailwindCSS 4, Shadcn UI, Vites (001-time-allocation-app)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, TailwindCSS 4, Shadcn UI, embla-carousel-react, react-use (for useMedia) (003-backlog-carousel-layout)
- IndexedDB (via Dexie.js) (003-backlog-carousel-layout)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, TailwindCSS 4, Shadcn UI (Drawer, Button, Dialog), Lucide React, react-use (for useMedia) (004-mobile-first-homepage-refactor)
- IndexedDB (via Dexie.js) - existing schema sufficien (004-mobile-first-homepage-refactor)

- TypeScript 5.x, Node.js 20+ (for tooling) + React 18+, Vite, TailwindCSS 4, Shadcn UI, Vites (001-time-allocation-app)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x, Node.js 20+ (for tooling): Follow standard conventions

## Recent Changes
- 004-mobile-first-homepage-refactor: Added TypeScript 5.x, Node.js v24.13.0+ + React 18+, TailwindCSS 4, Shadcn UI (Drawer, Button, Dialog), Lucide React, react-use (for useMedia)
- 003-backlog-carousel-layout: Added TypeScript 5.x, Node.js v24.13.0+ + React 18+, TailwindCSS 4, Shadcn UI, embla-carousel-react, react-use (for useMedia)
- 003-backlog-carousel-layout: Added TypeScript 5.x, Node.js v24.13.0+ + React 18+, TailwindCSS 4, Shadcn UI, embla-carousel-react, react-use (for useMedia)


## ReactJS Principles
- **Prefer `react-use`**: For common hooks (e.g., `useMedia`, `useToggle`, `useDebounce`), prefer using the `react-use` library instead of creating custom implementations to avoid reinventing the wheel.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
