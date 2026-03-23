# Quickstart: Backlog Routine Filter

## Setup for Testing
1. Ensure the database has at least one Category.
2. Under that Category, add at least two SubTasks:
    - One with type `daily`.
    - One with type `one-time`.
3. Open the "每日計劃" page.

## Verification Scenarios

### SC-001: Independent Filtering in Backlog
1. Click the "從待辦挑選" (Backlog) button to open the drawer.
2. **Verify**: Both the `daily` and `one-time` tasks are visible.
3. Toggle the "隱藏每日" switch to **ON**.
4. **Verify**: The `daily` task disappears; the `one-time` task remains visible.
5. Close the Backlog drawer.
6. Open the Backlog drawer again.
7. **Verify**: The switch has reset to **OFF**, and both tasks are visible again.

### SC-002: View Independence
1. In the main "每日計劃" toolbar, toggle "隱藏每日" to **ON**.
2. Open the Backlog drawer.
3. **Verify**: The Backlog drawer's filter is **OFF** (independent state).
4. Toggle the Backlog filter to **ON**.
5. Close the Backlog drawer.
6. **Verify**: The main page's filter remains **ON**.

### SC-003: Empty Category Handling
1. Ensure Category A only contains `daily` tasks.
2. Open Backlog drawer.
3. **Verify**: Category A is visible.
4. Toggle "隱藏每日" to **ON**.
5. **Verify**: Category A (including its header) is completely hidden.
