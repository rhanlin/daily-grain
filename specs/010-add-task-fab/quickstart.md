# Quickstart: Testing Add Task FAB

## Prerequisites
- Mobile device or browser with mobile view (DevTools).
- At least one Category exists.

## Verification Steps

### 1. Verify FAB Visibility
1.  Open the application in a mobile viewport (e.g., iPhone 12 width).
2.  Navigate to the Home Page.
3.  Click on any Category card to enter the Category Detail Page.
4.  **Verify**: A circular "+" button (FAB) appears in the bottom-right corner.

### 2. Verify Add Task Flow
1.  Click the FAB.
2.  **Verify**: A drawer opens with the title "新增任務" (Create Task).
3.  **Verify**: The "所屬分類" (Category) dropdown defaults to the current category.
4.  Enter a task title (e.g., "Test Task").
5.  Click "確認建立" (Confirm).
6.  **Verify**: The drawer closes.
7.  **Verify**: The new task appears in the list on the Category Detail Page.

### 3. Desktop Verification (Optional)
1.  Switch to desktop view.
2.  **Verify**: The FAB behavior (visible or hidden) aligns with design decisions (currently visible is acceptable, but optimized for mobile).
