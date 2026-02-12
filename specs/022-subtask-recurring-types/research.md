# Research: SubTask Recurring Types and Progress Tracking

## 1. Schema Migration (Dexie.js)

### Current State (Version 3)
- `SubTask`: `id, taskId, title, isCompleted, eisenhower, createdAt, updatedAt`
- `DailyPlanItem`: `id, date, refId, refType, orderIndex, isRollover, updatedAt`

### Proposed State (Version 4)
- `SubTask`: Add `type` ('one-time' | 'multi-time' | 'daily') and `repeatLimit` (number).
- `DailyPlanItem`: Add `isCompleted` (boolean).

### Migration Strategy
- **SubTask**: Default `type` to `'one-time'`. `repeatLimit` can be undefined or 0.
- **DailyPlanItem**: Initialize `isCompleted` based on the current status of the referenced Task/SubTask to preserve existing user state.
  - For `refType === 'TASK'`, check `db.tasks.get(refId).status === 'DONE'`.
  - For `refType === 'SUBTASK'`, check `db.subtasks.get(refId).isCompleted`.

## 2. Completion Logic for Recurring Tasks

### One-time (Default)
- Coupling: `DailyPlanItem.isCompleted` <-> `SubTask.isCompleted`.
- Changing one updates the other.

### Multi-time / Daily
- Decoupling: `DailyPlanItem.isCompleted` is independent.
- `SubTask.isCompleted` becomes a calculated property or is used to represent "completely finished" (for multi-time).
- **Progress Formula**: `numerator = count(DailyPlanItem where refId == id AND isCompleted == true)`, `denominator = SubTask.repeatLimit`.

## 3. UI Integration Points

### SubTask Creation/Edit (SubTaskList.tsx)
- Add a Select component for Type.
- If 'Multi-time' is selected, show a numeric input for `repeatLimit`.
- Display progress badge/text if type is not 'one-time'.

### Daily Plan Item (DailyPlanView.tsx -> PlanSubTaskItem)
- Use `DailyPlanItem.isCompleted` for the checkbox.
- Display progress (e.g., `2/3`) or Daily icon (∞) next to the title.

### Backlog Drawer
- Items should show progress/icons. Need to locate where backlog items are rendered.

## 4. Performance Considerations
- Querying `dailyPlanItems` for every subtask in a list might be slow if done naively.
- Optimization: Use a joined query or pre-calculate progress when fetching the list. Dexie's `useLiveQuery` is efficient for reactive updates.

## 5. Visual Assets
- **Daily Icon**: Lucide `Infinity` or `RotateCcw`.
- **Progress**: Simple text `2/3` or a small progress bar. The spec suggests text `2/3`.
- **Exceeding Limit**: Use `text-destructive` (red) for the progress text.
