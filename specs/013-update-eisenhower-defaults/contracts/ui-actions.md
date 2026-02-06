# UI Contracts: Update Eisenhower Defaults

## Repository Actions

### `repository.tasks.create(categoryId, title, description)`
- **Behavior**: Sets `eisenhower: 'Q4'` by default.
- **Input**: `categoryId`, `title`, `description`.
- **Output**: `Promise<Task>`.

### `repository.subtasks.create(taskId, title)`
- **Behavior**: Fetches parent task and sets `eisenhower: parentTask.eisenhower`.
- **Input**: `taskId`, `title`.
- **Output**: `Promise<SubTask>`.

## UI Components

### `QuickCreateTaskDrawer`
- **Behavior**: Must ensure new tasks are created with **Q4** default.
