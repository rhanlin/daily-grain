# Research: PWA Custom Logo Integration

**Feature**: PWA Custom Logo Integration
**Status**: Complete

## Executive Summary
The project uses `vite-plugin-pwa` for PWA capabilities. The current configuration in `vite.config.ts` is structurally sound but requires updates to metadata (application name) and asset references to match the new branding requirements. No new dependencies are required.

## Technical Decisions

### 1. PWA Configuration Strategy
- **Decision**: Update existing `vite.config.ts` configuration.
- **Rationale**: `vite-plugin-pwa` is already integrated. Modifying the existing config is the most efficient and standard way to update PWA metadata.
- **Details**:
    - Update `manifest.name` and `manifest.short_name` to "DailyGrain".
    - Verify `manifest.icons` paths match the new asset locations in `public/icons/`.
    - Ensure `includeAssets` includes the new `apple-touch-icon.webp` and `maskable-icon.webp`.
    - Set `theme_color` to `#ffffff`.

### 2. Asset Management
- **Decision**: Host assets in `public/icons/` and reference them relative to root.
- **Rationale**: Vite serves the `public/` directory at the server root. This allows stable paths like `/icons/icon-192x192.webp` which are required for the manifest.

### 3. Favicon Replacement
- **Decision**: Replace `public/vite.svg` (or update `index.html` ref) and `public/favicon.ico`.
- **Rationale**: To ensure branding consistency across browser tabs and PWA install prompts.

## Implementation Details

### Manifest Configuration Target
```typescript
{
  name: 'DailyGrain',
  short_name: 'DailyGrain',
  description: 'Master Your Time, Grain by Grain.',
  theme_color: '#ffffff',
  icons: [
    // Standard and Maskable icons
  ]
}
```

## Open Questions / Risks
- **Risk**: Browser caching of `manifest.webmanifest`.
- **Mitigation**: `vite-plugin-pwa` handles cache busting for assets, but manifest updates might require "Unregister Service Worker" in DevTools for immediate local testing.