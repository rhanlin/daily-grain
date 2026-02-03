# Data Model

**Feature**: 001-time-allocation-app
**Storage**: IndexedDB (Dexie.js) primary, Firestore secondary.

## Entities

### Category (主題分類)
High-level buckets for tasks.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier (Primary Key) |
| `name` | String | Display name (e.g., "Work", "Personal") |
| `color` | String | Hex code for UI tagging |
| `createdAt` | ISO8601 | Creation timestamp |
| `updatedAt` | ISO8601 | For sync resolution |
| `isArchived` | Boolean | Soft delete flag |

### Task (工作項目)
Main unit of work.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `categoryId` | UUID | Foreign Key to Category |
| `title` | String | Task summary |
| `description` | String | Detailed notes |
| `status` | Enum | `TODO` | `DONE` | `ARCHIVED` |
| `eisenhower` | Enum | `Q1` (Do), `Q2` (Plan), `Q3` (Delegate), `Q4` (Eliminate) |
| `updatedAt` | ISO8601 | Last-Write-Wins timestamp |
| `completedAt` | ISO8601 | When it was marked done |

### SubTask (子任務)
Granular checklist items within a Task.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `taskId` | UUID | Foreign Key to Task |
| `title` | String | Item text |
| `isCompleted` | Boolean | Completion status |
| `eisenhower` | Enum | Inherited or independent (Q1-Q4) |
| `updatedAt` | ISO8601 | For sync resolution |

### DailyPlanItem (每日計畫項目)
Mapping of work units to specific days.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `date` | String | Format: `YYYY-MM-DD` |
| `refId` | UUID | ID of the Task or SubTask |
| `refType` | Enum | `TASK` | `SUBTASK` |
| `orderIndex` | Float | Manual drag-and-drop order |
| `isRollover` | Boolean | Auto-moved from previous day |
| `updatedAt` | ISO8601 | For sync resolution |

## Constraints & logic

- **Cascade Delete**: Deleting a `Category` soft-deletes its `Tasks`. Deleting a `Task` (Archive) soft-deletes `SubTasks` and removes associated `DailyPlanItems`.
- **Uniqueness**: `DailyPlanItem` must be unique by `(date, refId)`.
- **Backlog**: `Backlog = All Tasks - (Done + Archived + Scheduled_On_Selected_Date)`.

## Sync Protocol (Dexie <-> Firestore)

- **Collections**: Firestore will mirror the tables: `categories`, `tasks`, `subtasks`, `dailyPlanItems`.
- **Logic**:
  - `onSnapshot` (Firestore) -> Updates Dexie if `remote.updatedAt > local.updatedAt`.
  - `useLiveQuery` (Dexie) -> `useEffect` detects local change -> Writes to Firestore.