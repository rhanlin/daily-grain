# Data Model: Update Eisenhower Defaults

## Overview
This feature introduces logic-based default values for the Eisenhower Matrix. No schema changes are required as the `eisenhower` field already exists.

## Entities

### Task
| Field | Type | Default | Logic |
|-------|------|---------|-------|
| `eisenhower` | `'Q1' \| 'Q2' \| 'Q3' \| 'Q4'` | **`Q4`** | Hardcoded default for all new tasks. |

### SubTask
| Field | Type | Default | Logic |
|-------|------|---------|-------|
| `eisenhower` | `'Q1' \| 'Q2' \| 'Q3' \| 'Q4'` | **Inherited** | Inherits from `Task.eisenhower`. Fallback to `Q4`. |

## Inheritance Rule
When creating a `SubTask`:
1. Find `Task` where `Task.id == SubTask.taskId`.
2. Set `SubTask.eisenhower = Task.eisenhower`.
3. If Task not found, set `SubTask.eisenhower = 'Q4'`.
