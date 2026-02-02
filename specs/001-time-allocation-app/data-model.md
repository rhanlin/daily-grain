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
| `updatedAt` | ISO8601 | For sync resolution |

### DailyPlanItem (每日計畫項目)
Mapping of work units to specific days with manual ordering.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `date` | String | Format: `YYYY-MM-DD` |
| `refId` | UUID | ID of the Task or SubTask |
| `refType` | Enum | `TASK` | `SUBTASK` |
| `orderIndex` | Float | Floating point for easy drag-and-drop reordering |
| `isRollover` | Boolean | True if automatically moved from previous day |
| `updatedAt` | ISO8601 | For sync resolution |

## Relationships

- **Category** has many **Tasks**.
- **Task** has many **SubTasks**.
- **DailyPlanItem** points to one **Task** OR **SubTask**.

## Sync Protocol (Dexie <-> Firestore)

- **Collections**: Firestore will mirror the tables: `categories`, `tasks`, `subtasks`, `dailyPlanItems`.
- **Logic**:
  - `onSnapshot` (Firestore) -> Updates Dexie if `remote.updatedAt > local.updatedAt`.
  - `useLiveQuery` (Dexie) -> `useEffect` detects local change -> Writes to Firestore.
