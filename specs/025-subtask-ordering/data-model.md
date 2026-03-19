# Data Model: SubTask Chronic Ordering

## Entities

### SubTask (Existing)
*Fields*:
- `id`: string (UUID)
- `taskId`: string (Foreign Key)
- `title`: string
- `isCompleted`: boolean
- `type`: SubTaskType
- `createdAt`: string (ISO 8601) - **Primary Sort Index**
- `updatedAt`: string (ISO 8601) - **Secondary Fallback**

## Logic Layer: Sorting Algorithm

```typescript
const subtaskComparator = (a: SubTask, b: SubTask) => {
  const timeA = a.createdAt || a.updatedAt || '';
  const timeB = b.createdAt || b.updatedAt || '';
  
  if (timeA !== timeB) {
    return timeA.localeCompare(timeB);
  }
  
  // Tie-breaker
  return a.id.localeCompare(b.id);
};
```

## UI State: Backlog Grouping
The `useBacklog` hook should return subtasks grouped by `taskId` while maintaining the above sort order within each group.
Grouping key: `taskId`
Sorting inside group: `subtaskComparator`
Grouping order: Optional (but should probably match parent Task's order if possible, though not strictly required for this spec).
