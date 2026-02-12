# Quickstart: SubTask Recurring Types

## 1. Setup
- Ensure you are on branch `022-subtask-recurring-types`.
- Run `npm install`.
- Start dev server: `npm run dev`.

## 2. Test One-time SubTask (Default)
- Open a Category and a Task.
- Add a SubTask. Verify it defaults to "One-time".
- Add it to Daily Plan.
- Check it in Daily Plan. Verify it's marked DONE in the Backlog as well.

## 3. Test Multi-time SubTask
- Create a new SubTask, select "Multi-time", set limit to `2`.
- Verify it shows `0/2` in the Backlog.
- Add it to Today's Daily Plan.
- Add it again to Today's Daily Plan (or another day).
- Mark one instance as DONE.
- Verify Backlog and Daily Plan both show `1/2`.
- Mark second instance as DONE.
- Verify progress shows `2/2`.

## 4. Test Daily SubTask
- Create a new SubTask, select "Daily".
- Verify it shows the Infinity (∞) icon.
- Add it to multiple days.
- Verify marking one day DONE does not affect other days.

## 5. Schema Verification
- Open Browser DevTools -> Application -> IndexedDB.
- Check `PNoteDatabase` version 4.
- Verify `subtasks` table has `type` and `repeatLimit`.
- Verify `dailyPlanItems` table has `isCompleted`.
