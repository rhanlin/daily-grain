# Data Model: Category Management

## View Model: Category Action Context
Data passed to the `CategoryActionDrawer`.

| Field | Type | Description |
|-------|------|-------------|
| `categoryId` | UUID | The ID of the targeted category |
| `name` | String | Current name for editing |

## Repository Methods (Updates)
Add these to `lib/repository.ts` if not already present or robust enough.

### `categories`
- `update(id: string, data: Partial<Category>)`: Updates category fields (e.g., name, color).
- `delete(id: string)`: Archives or removes a category.
