# Quickstart Guide: Personal Time Allocation App

**Feature**: 001-time-allocation-app
**Stack**: React, Vite, Tailwind 4, Shadcn, Dexie.js, Firebase.

## Prerequisites

- Node.js 20+
- Firebase Project (Create at [console.firebase.google.com](https://console.firebase.google.com))
- Enable **Authentication** (Google Provider) in Firebase Console
- Enable **Cloud Firestore** in Firebase Console

## Initialization

1.  **Clone & Install**
    ```bash
    git clone <repo>
    cd p-note
    npm install
    ```

2.  **Environment Setup**
    Create `.env.local`:
    ```env
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    VITE_FIREBASE_PROJECT_ID=...
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Development Workflow

1.  **UI Development**:
    - Use `npx shadcn@latest add <component>` to add UI primitives.
    - Styles in `src/index.css` (Tailwind 4).

2.  **Database Changes**:
    - Modify `src/lib/db.ts` (Dexie schema).
    - If schema changes, bump version number in `db.version(X)`.

3.  **Testing**:
    ```bash
    npm run test        # Run Unit Tests (Vitest)
    npm run test:ui     # Open Vitest UI
    ```

## Key Commands

- `npm run dev`: Start Vite server.
- `npm run build`: Build PWA.
- `npm run preview`: Preview build.
- `npm run lint`: Lint code.
