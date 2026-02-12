# Quickstart: Redefined Task Completion

## 1. Automatic DONE Verification
- Create a Task.
- Add an `one-time` subtask. Mark it as done. Task should be **DONE**.
- Add a `multi-time` subtask (limit 2). Task should revert to **TODO**.
- Add the `multi-time` subtask to Daily Plan and check it once. Task stays **TODO**.
- Check it a second time. Task should be **DONE**.

## 2. Daily Task & Manual Override Verification
- Create a Task.
- Add an `one-time` subtask. Mark it as done. Task is **DONE**.
- Add a `daily` subtask. Task should revert to **TODO**.
- Mark the `daily` subtask instance as done in the Daily Plan. Task stays **TODO** (Daily items never auto-complete parent).
- **NEW**: Go to Task Management, find the `daily` subtask, and check its checkbox (Manual Complete). Task should flip to **DONE**.

## 3. Multi-time Manual Override Verification
- Create a Task with a `multi-time` subtask (limit 10).
- Progress is 0/10. Task is **TODO**.
- Go to Task Management, check the `multi-time` subtask directly.
- Task should flip to **DONE** immediately, ignoring the 0/10 count.

## 4. Manual Task Completion & History
- Create a Task with `one-time`, `multi-time` (0/5), and `daily` subtasks.
- Manually mark Task as **DONE**.
- Verify:
    - `one-time` is checked.
    - `multi-time` remains unchecked (0/5).
    - `daily` remains unchecked.
