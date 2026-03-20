# Data Model: Daily Plan Gestures & Filters

## Logic Layer

### Filtered Item Selection
- **Inputs**: `DailyPlanItem[]`, `SubTask[]` map, `hideDaily: boolean`
- **Output**: `filteredPlanItems: DailyPlanItem[]`
- **Rule**: `item.refType === 'SUBTASK' && subtaskMap[item.refId].type === 'daily' && hideDaily === true` -> Exclude.

### Cross-Date Move (Atomic Update)
- **Trigger**: Drop on `side-panel-prev` or `side-panel-next`.
- **Target Date**: `selectedDate ± 1 day`.
- **Action**:
    1. Update `date` of the specific `DailyPlanItem`.
    2. Recalculate `orderIndex` to append to the end of the target day's list.
    3. Persist to IndexedDB.

### Filter-Aware Reorder Algorithm
```typescript
const reorderFiltered = (allItems: Item[], visibleIds: string[], targetIds: string[]) => {
  const newOrder = [...allItems];
  const visibleIndices = allItems
    .map((item, idx) => visibleIds.includes(item.id) ? idx : -1)
    .filter(idx => idx !== -1);

  // Map the new order of visible IDs to the original absolute slots
  targetIds.forEach((id, i) => {
    const originalSlot = visibleIndices[i];
    newOrder[originalSlot] = allItems.find(item => item.id === id)!;
  });

  return newOrder;
};
```
