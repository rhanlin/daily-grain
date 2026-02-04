# Quickstart: Verifying Drag Optimization

## Prerequisites
- Mobile device or Chrome DevTools (Device Mode).

## Verification Steps

### 1. Reordering Stability (Manual Mode)
1. Open "Daily Plan" page.
2. Ensure "Sort by Matrix" is **OFF**.
3. Tap and hold the **Grip Icon** (Handle).
4. Drag to reorder.
5. **Verify**: Item moves smoothly; NO Drawer opens.
6. **Verify**: Refresh page; order remains saved.

### 2. Matrix Sort Conflict
1. Turn "Sort by Matrix" **ON**.
2. **Verify**: Drag handles (Grip icons) disappear.
3. **Verify**: Attempting to drag any part of the card has no effect.

### 3. Menu Access
1. Tap the **...** (More) button on the right of any card.
2. **Verify**: The action Drawer opens immediately.

### 4. Long-Press Removal
1. Long-press on the center of any task card.
2. **Verify**: No Drawer opens (previous behavior is removed).