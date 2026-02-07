# Quickstart: Verify Fix

## Prerequisites
- A mobile device or Browser DevTools simulating a mobile viewport (e.g., iPhone SE, Pixel 5).
- Local development server running (`npm run dev`).

## Steps

1. **Launch App**: Open the application in a mobile viewport (width < 768px).
2. **Navigate**: Go to the "Daily Plan" page (root URL `/`).
3. **Open Calendar**: Tap the date text at the top of the screen (e.g., "2026/02/08 (Sunday)").
4. **Observe**: The Calendar Drawer should slide down from the top (or up, depending on config).
5. **Verify Layout**:
   - The calendar grid (days) should be fully visible within the screen width.
   - There should be no horizontal scrolling required to see the full week.
   - The content should not be cut off at the edges.
   - **Fix Confirmation**: The container padding should not force the calendar out of bounds.

## Troubleshooting

- If the calendar is still too wide, check if `text-xl` or large font sizes in the calendar component are causing expansion.
- Ensure `useMedia` is correctly identifying the mobile viewport.
