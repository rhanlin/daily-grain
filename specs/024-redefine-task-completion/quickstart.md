# Quickstart: Redefined Task Completion

## 1. Automatic DONE Verification
- Create a Task.
- Add an `one-time` subtask. Mark it as done. Task should be **DONE**.
- Add a `multi-time` subtask (limit 2). Task should revert to **TODO**.
- Add the `multi-time` subtask to Daily Plan and check it once. Task stays **TODO**.
- Check it a second time. Task should be **DONE**.

## 2. Daily Task Isolation Verification
- Create a Task.
- Add an `one-time` subtask. Mark it as done. Task is **DONE**.
- Add a `daily` subtask. Task should revert to **TODO**.
- Mark the `daily` subtask instance as done in the Daily Plan. Task stays **TODO** (Daily items never auto-complete parent).

## 3. Manual Override Verification
- Take the Task with the `daily` subtask (from Step 2).
- Manually mark the Task as **DONE** in Task Management.
- Task should be **DONE** and hide from Backlog.
- Verify `one-time` subs are all `isCompleted = true`.
- Verify `daily` sub definition is unchanged.

## 4. Performance Check
- Perform the above actions and observe UI responsiveness. Task status flips should feel instantaneous (< 50ms).
