# Quickstart: Verifying Home Page Refactor

## Prerequisites
- Local environment running.
- Access to browser DevTools.

## Verification Steps

### 1. Root Path Entry
1. Open `http://localhost:5173/`.
2. **Verify**: The page title is "每日計畫" and shows the date selector.

### 2. Terminology Check
1. Look at the Sidebar (Desktop) or Bottom Nav (Mobile).
2. **Verify**: The first icon is labeled "任務管理".
3. Navigate to "任務管理".
4. **Verify**: The URL is `/management`.

### 3. Empty Backlog Guidance
1. Ensure you have no tasks created (or delete them).
2. Go to the Home Page (Daily Plan).
3. Open the "待辦清單" (Backlog) Drawer.
4. **Verify**: Message "無任務項目" appears.
5. **Verify**: A button "前往任務管理" is visible.
6. Click the button.
7. **Verify**: Drawer closes and URL becomes `/management`.
