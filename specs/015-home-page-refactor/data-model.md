# Data Model: Home Page Refactor & Terminology Update

## Overview
This feature does not require persistent data model changes. It focuses on UI state and routing.

## Routing Model

| Path | Component | New Display Name | Former Display Name |
|------|-----------|------------------|---------------------|
| `/` | `DailyPlanPage` | 每日計畫 | (N/A - was /daily-plan) |
| `/management` | `HomePage` | 任務管理 | 主題分類 |
| `/matrix` | `MatrixPage` | 艾森豪矩陣 | (unchanged) |

## UI State Transitions (Empty Backlog)

1. **State**: `groups.length === 0` in `BacklogContent`.
2. **Action**: User clicks "前往任務管理".
3. **Transition**: 
    - `navigate('/management')`
    - Close Backlog Drawer.
