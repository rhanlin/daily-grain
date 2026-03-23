# Quickstart: Backlog Carousel Swipe Optimization

## Setup for Testing
1. Add at least 3 categories with tasks.
2. Open "每日計劃" -> Click "從待辦挑選".
3. Use a mobile device (Android for vibration, iOS for paging check).

## Verification Steps

### SC-001: Paging Interaction
1. Perform a swipe gesture on the carousel.
2. **Verify**: The card auto-scrolls and snaps to the next/previous category cleanly.
3. **Verify**: There is no "continuous scaling" effect during the drag process.

### SC-002: Haptic Feedback (Android)
1. Swipe to a new category.
2. **Verify**: The device vibrates for a short duration.
3. **Debug**: If no vibration, check if a Toast "Haptic: 20ms" appears (verify logic execution).

### SC-003: Performance Check
1. Rapidly swipe through 5+ categories.
2. **Verify**: No frame drops or UI hangs. The paging animation remains responsive.
