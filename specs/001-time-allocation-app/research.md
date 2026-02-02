# Research & Technology Decisions

**Feature**: 001-time-allocation-app (Personal Time Allocation App)
**Date**: 2026-02-01

## 1. Backend & Sync Strategy

**Decision**: **Firebase (Firestore + Authentication)** coupled with **Dexie.js (IndexedDB)**.

**Rationale**:
- **Offline Capability**: While Firestore has offline support, **Dexie.js** provides a robust, fully local database (IndexedDB) that ensures the app works perfectly 100% offline with zero latency. It decouples UI performance from network state.
- **Sync**: We will implement a custom sync logic (Last-Write-Wins) between Dexie and Firestore. This aligns with the "Local-First" architecture where the device is the primary source of truth.
- **Auth**: Firebase Authentication handles Google Sign-In seamlessly, which is a project requirement.
- **MVP Speed**: Firebase offers a serverless backend, avoiding the need to maintain a separate API server for this phase.

**Alternatives Considered**:
- **Supabase**: Excellent SQL support, but offline-sync libraries (like RxDB or WatermelonDB) add significant complexity compared to a lightweight Dexie + Firestore approach for a single-user MVP.
- **RxDB**: Powerful but has a steep learning curve (RxJS) and adds bundle size. Dexie is simpler for React developers.

## 2. Drag and Drop Library

**Decision**: **dnd-kit**.

**Rationale**:
- **Touch Support**: Critical for "Mobile-First" PWA. `dnd-kit` has a sophisticated sensor system (Pointer, Touch, Mouse) that handles mobile interactions better than older libraries.
- **Flexibility**: Supports the complex "Cross-Container" dragging required (moving tasks from Categories to Daily Plan) and "Manual Sorting" (reordering within Daily Plan).
- **Modern**: Hook-based API fits naturally with modern React functional components.

**Alternatives Considered**:
- **react-beautiful-dnd**: Currently in maintenance mode. Has known issues with React 18+ Strict Mode and touch responsiveness on some devices.
- **HTML5 Drag and Drop API**: Native API has poor mobile support (no touch events without polyfills) and is difficult to style.

## 3. UI Framework & Styling

**Decision**: **Shadcn UI** + **TailwindCSS v4**.

**Rationale**:
- **Consistency**: Shadcn provides high-quality, accessible components (Cards, Dialogs, Inputs) that adhere to the "Consistent UX" principle.
- **Customization**: Code-based (copy-paste) nature allows full control over component styles, unlike rigid library wrappers.
- **Performance**: Tailwind v4 (Oxide engine) is incredibly fast and produces minimal CSS bundles.

## 4. Testing Framework

**Decision**: **Vitest** + **React Testing Library**.

**Rationale**:
- **Speed**: Vitest is native to Vite, offering instant test runs compared to Jest.
- **Compatibility**: Configuration is shared with Vite, reducing boilerplate.
- **Behavior Testing**: React Testing Library enforces testing from the user's perspective (e.g., "User clicks button" rather than "State equals X").

## 5. Implementation Strategy: Local-First

**Workflow**:
1.  **Writes**: UI writes directly to Dexie.js (IndexedDB).
2.  **Reads**: UI reads from Dexie.js (via `useLiveQuery`).
3.  **Sync**: A background `useEffect` or Service Worker listens for Dexie changes and pushes to Firestore when online.
4.  **Conflicts**: Last-Write-Wins based on `updatedAt` timestamp.

**Benefits**:
- **Zero Latency**: User interactions never wait for the network.
- **Reliability**: App works indefinitely without internet.
