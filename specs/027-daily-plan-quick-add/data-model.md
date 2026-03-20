# Data Model: Daily Plan Quick Add

## Entities

### SubTask (Existing)
*Fields*:
- `id`: string (UUID)
- `taskId`: string (Foreign Key)
- `title`: string
- `isCompleted`: boolean
- `type`: 'one-time' | 'multi-time' | 'daily'
- `createdAt`: string
- `updatedAt`: string

### DailyPlanItem (Existing)
*Fields*:
- `id`: string (UUID)
- `date`: string (ISO 8601)
- `refId`: string (SubTask ID)
- `refType`: 'SUBTASK'
- `isCompleted`: boolean
- `orderIndex`: number

## Derived Logic: Quick Creation Helper

```typescript
interface QuickAddParams {
  title: string;
  date: string;
  categoryId?: string;
  taskId?: string;
  type: SubTaskType;
}
```

**Fallback Logic**:
If `taskId` is missing:
1. Try to find the last created Task in the system.
2. If none, create a default Category ("一般") and a default Task ("日常任務").
3. Use that `taskId` for the new SubTask.
