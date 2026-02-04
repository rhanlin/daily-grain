# Data Model: Add Task FAB on Mobile

## Overview
This feature utilizes the existing `Task` and `Category` entities. No schema changes are required.

## Entities

### Task (Existing)
- **id**: UUID
- **categoryId**: Foreign Key to Category
- **title**: String
- **description**: String
- **status**: 'TODO' | 'DONE' | 'ARCHIVED'
- **eisenhower**: 'Q1' | 'Q2' | 'Q3' | 'Q4'
- **updatedAt**: ISO Date String

### Category (Existing)
- **id**: UUID
- **name**: String
- **color**: Hex String
- **isArchived**: Boolean

## Interaction
- The FAB will create a new `Task` entity.
- The `categoryId` of the new Task will be automatically set to the ID of the `Category` currently being viewed.
