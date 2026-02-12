# p-note Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-02

## Active Technologies
- TypeScript 5.x, Node.js v24.13.0+ (for tooling) + React 18+, Vite, TailwindCSS 4, Shadcn UI, Vites (001-time-allocation-app)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, TailwindCSS 4, Shadcn UI, embla-carousel-react, react-use (for useMedia) (003-backlog-carousel-layout)
- IndexedDB (via Dexie.js) (003-backlog-carousel-layout)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, TailwindCSS 4, Shadcn UI (Drawer, Button, Dialog), Lucide React, react-use (for useMedia) (004-mobile-first-homepage-refactor)
- IndexedDB (via Dexie.js) - existing schema sufficien (004-mobile-first-homepage-refactor)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, TailwindCSS 4, Shadcn UI (Drawer, Button, Dialog), Lucide React, react-use (for `useLongPress`) (005-category-management-refactor)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, Dexie.js, dexie-react-hooks (006-sync-backlog-data)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, TailwindCSS 4, Lucide React, Radix UI (Scroll Area) (007-matrix-ui-refactor)
- IndexedDB (via Dexie.js) - existing schema remains unchanged. (007-matrix-ui-refactor)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, Dexie.js, dexie-react-hooks, @dnd-kit/core (008-refine-backlog-filtering)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, Vite, vite-plugin-pwa (009-pwa-custom-logo)
- N/A (Static Assets) (009-pwa-custom-logo)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, TailwindCSS 4, Shadcn UI (Drawer, Button), Lucide React, react-use (for useMedia) (010-add-task-fab)
- IndexedDB (via Dexie.js) - Schema v2 added `createdAt` field to Tasks/Subtasks. (010-add-task-fab)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, dnd-kit, Lucide React, TailwindCSS 4, Shadcn UI (011-daily-plan-drag-optimization)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, react-use (for `useLongPress`), Lucide React, Shadcn UI (012-backlog-multi-select)
- N/A (Transient UI State) - Updates `dailyPlanItems` table (012-backlog-multi-select)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, Dexie.js (IndexedDB), Lucide React, Shadcn UI (013-update-eisenhower-defaults)
- IndexedDB (Existing Task/SubTask tables) (013-update-eisenhower-defaults)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, Framer Motion, Shadcn UI (Dialog, Drawer), Lucide React, react-use (014-daily-plan-ux-enhancement)
- N/A (Transient UI State for swipe/edit); Persistent updates to `tasks` and `subtasks` tables. (014-daily-plan-ux-enhancement)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, React Router DOM, Shadcn UI, Framer Motion (015-home-page-refactor)
- N/A (UI and Routing only) (015-home-page-refactor)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, Shadcn UI, Lucide Reac (016-fix-swipe-conflict)
- N/A (UI state only) (016-fix-swipe-conflict)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, dnd-kit, Tailwind CSS 4, Dexie.js (017-task-ui-refinement)
- IndexedDB (Categories table v3 with `orderIndex`) (017-task-ui-refinement)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, Dexie.js (IndexedDB), Tailwind CSS 4, Shadcn UI (018-backlog-rollover-fixes)
- IndexedDB (Updates `dailyPlanItems`) (018-backlog-rollover-fixes)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, TailwindCSS 4, Shadcn UI (Drawer), Lucide Reac (019-fix-mobile-calendar-overflow)
- N/A (UI Layout Fix) (019-fix-mobile-calendar-overflow)
- TypeScript 5.x, React 18+ + Dexie.js, dexie-react-hooks (020-fix-cleanup-subtasks)
- IndexedDB (via Dexie) (020-fix-cleanup-subtasks)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, Dexie.js (IndexedDB), Shadcn UI, Lucide Reac (022-subtask-recurring-types)
- IndexedDB (via Dexie) - Upgrade to Version 4 required. (022-subtask-recurring-types)
- TypeScript 5.x, Node.js v24.13.0+ + React 18+, Vite, TailwindCSS 4, Shadcn UI, Dexie.js (IndexedDB) (022-subtask-recurring-types)
- IndexedDB (via Dexie.js) - Schema v4 Migration (022-subtask-recurring-types)
- Node.js v24.13.0+, TypeScript 5.9+ + Husky (v9+), lint-staged (001-add-husky-git-hooks)
- IndexedDB (via Dexie.js) - Schema v4 (from 022) (024-redefine-task-completion)

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
- 024-redefine-task-completion: Added TypeScript 5.x, Node.js v24.13.0+ + React 18+, Dexie.js (IndexedDB)
- 024-redefine-task-completion: Added TypeScript 5.x, Node.js v24.13.0+ + React 18+, Dexie.js (IndexedDB)
- 001-add-husky-git-hooks: Added Node.js v24.13.0+, TypeScript 5.9+ + Husky (v9+), lint-staged


## ReactJS Principles
- **Prefer `react-use`**: For common hooks (e.g., `useMedia`, `useToggle`, `useDebounce`), prefer using the `react-use` library instead of creating custom implementations to avoid reinventing the wheel.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
