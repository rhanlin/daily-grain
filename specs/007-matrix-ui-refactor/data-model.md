# Data Model: Matrix View State

This feature focuses on UI transformation. The existing `Task` and `Category` entities are used without modification.

## View Mapping: Quadrant Configuration

| Quadrant | Action | Background Color | Label (X/Y) |
|----------|--------|------------------|-------------|
| **Q1**   | DO | `#cee9f2` | Urgent / Important |
| **Q2**   | DECIDE | `#d0ebca` | Not Urgent / Important |
| **Q3**   | DELEGATE | `#fddfbd` | Urgent / Not Important |
| **Q4**   | ELIMINATE | `#fca2a1` | Not Urgent / Not Important |

## Derived Entity: MatrixItem
A lightweight version of the Task entity used for the matrix display.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Task ID |
| `title` | String | Task title |
| `categoryColor` | HEX | Color code from the parent Category |
| `eisenhower` | Enum | Q1, Q2, Q3, or Q4 |
