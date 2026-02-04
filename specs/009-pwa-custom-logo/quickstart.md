# Quickstart: Verifying PWA Custom Logo

## Prerequisites
- Node.js 20+
- Modern Browser (Chrome/Edge/Safari)

## Setup & Build

1.  **Install Dependencies** (if not already done):
    ```bash
    npm install
    ```

2.  **Build the Application**:
    PWA manifests are generated during the build process.
    ```bash
    npm run build
    ```

3.  **Preview the Build**:
    Serve the production build locally to test the PWA features.
    ```bash
    npm run preview
    ```

## Verification Steps

### 1. Browser DevTools (Chrome)
1.  Open Developer Tools (F12).
2.  Go to the **Application** tab.
3.  Select **Manifest** from the sidebar.
4.  **Verify**:
    - App Name is "DailyGrain".
    - Icons section shows the new custom logos (192, 512, Maskable).
    - No warnings or errors are present.

### 2. Lighthouse Audit
1.  In Developer Tools, go to the **Lighthouse** tab.
2.  Select **Progressive Web App** category.
3.  Click **Analyze page load**.
4.  **Verify**: The "Installable" check is passed.

### 3. Visual Check (Favicon)
1.  Look at the browser tab.
2.  **Verify**: The icon matches the new custom logo (not the default Vite logo).