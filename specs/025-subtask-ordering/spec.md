# Feature Spec: SubTask Chronic Ordering

## Summary
目前子任務 (SubTask) 在 UI 中的排序是隨機的（因為依照 UUID 排序）。本功能旨在確保所有子任務在獲取時，預設皆按照「創建時間 (createdAt)」由舊到新排序，確保新建立的子任務始終顯示在清單的最下方。

## Clarifications
### Session 2026-03-19
- Q: 在待辦清單 (Backlog) 視圖中，當子任務來自不同任務時，應如何排序？ → A: A (先按「所屬任務 (TaskId)」分組，各組內再按 `createdAt` 排序)
- Q: 對於舊有的數據（即 createdAt 欄位可能為空或不準確的存量數據），應如何處理其排序？ → A: A (使用 updatedAt 作為回退 fallback)

## Functional Requirements
- **FR-001**: 子任務清單 (Task 詳情頁) 應按照 `createdAt` 升冪排序。
- **FR-002**: 艾森豪矩陣 (Matrix) 中的子任務清單也應維持穩定的排序邏輯。
- **FR-003**: 待辦清單 (Backlog) 應先按所屬任務 (TaskId) 分組，各組內部子任務依 `createdAt` 升冪排列。

## Data Model
- 延用 `subtasks` 表中的 `createdAt` 欄位（Schema v4 已包含索引）。
- **Fallback Logic**: 排序時優先使用 `createdAt`，若不存在則回退至 `updatedAt`。

## Acceptance Criteria
1. 在任務中新增子任務時，新項目必須排在清單的最後一個。
2. 重新整理頁面後，子任務的順序必須保持一致，不再隨機跳動。
