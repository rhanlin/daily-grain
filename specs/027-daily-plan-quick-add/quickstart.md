# Quickstart: Daily Plan Quick Add (UX Verified)

## Setup for Testing
1. Ensure you have at least one Category and one Task created.
2. Navigate to the "每日計劃" (Daily Plan) page.

## Verification Steps

### SC-001: Mobile Speed Dial Experience
1. Open Daily Plan on a mobile emulator.
2. Verify only ONE Plus button exists in the bottom right.
3. Click the Plus button.
4. Verify backdrop blur appears and two options (Backlog / Quick Add) stagger up.
5. Click "快捷新增".
6. Verify title input is focused. Enter "買晚餐", press Enter.
7. Verify item is added to the list and drawer closes.

### SC-002: Desktop Sidebar Speed
1. Open Daily Plan on Desktop.
2. Verify an input field exists at the top of the Backlog sidebar.
3. Type "完成報告" and press Enter.
4. Verify "完成報告" is immediately added to today's plan.

### SC-003: Continuous Mode (Mobile)
1. Click Plus -> Quick Add.
2. Toggle "連續新增".
3. Enter "Task 1", Enter.
4. Verify drawer stays open.
5. Enter "Task 2", Enter.
6. Close drawer and verify both tasks are in the list.

### SC-004: Edge Case - Fresh User
1. Clear IndexedDB data.
2. Go to Daily Plan -> Quick Add.
3. Enter "第一件事", click Add.
4. Verify subtask is created under a default "一般" category.
