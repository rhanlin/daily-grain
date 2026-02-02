<!-- Sync Impact Report
Version Change: 1.0.0 -> 1.1.0
Modified Principles:
- Added: VI. 圖像化與可視化溝通 (Visual Documentation)
Templates Status:
- .specify/templates/plan-template.md: ✅ (Logic aligns)
- .specify/templates/spec-template.md: ✅ (Logic aligns)
- .specify/templates/tasks-template.md: ✅ (Logic aligns)
-->

# P-Note 專案憲章 (Project Constitution)

## 核心原則 (Core Principles)

### I. 高品質與可測試性 (High Quality & Testability)
代碼品質是專案的基石。所有功能必須具備高品質、易讀性與可維護性。**可測試性 (Testability)** 是硬性規定；所有邏輯必須編寫測試，且測試應易於撰寫與執行。不接受無法被自動化測試覆蓋的複雜邏輯。

### II. 使用者體驗一致性 (Consistent UX)
使用者體驗 (UX) 必須在整個應用中保持一致。無論是操作邏輯、視覺回饋還是錯誤訊息，都必須遵循統一的設計模式，確保使用者無須重新學習。

### III. 效能優先 (Performance Centric)
效能是核心考量，而非事後優化。在設計與實作階段，必須優先考量資源消耗與回應速度。任何功能引入不應顯著拖慢系統效能。

### IV. MVP 與避免過度設計 (MVP & No Overdesign)
專注於 **最小可行性產品 (MVP)**。嚴格禁止過度設計 (Overdesign)。只實作當前需求所必需的功能，拒絕 "未來可能需要" 的預測性開發。簡單優於複雜。

### V. 全面正體中文 (Traditional Chinese Only)
專案的所有產出物，包括但不限於文檔、代碼註解、使用者介面文字、Git Commit Message 與溝通內容，一律使用 **正體中文 (Traditional Chinese)**。

### VI. 圖像化與可視化溝通 (Visual Documentation)
除了文字敘述外，優先採用 **圖像化方式**（如 UML Diagram、架構圖、資料流圖）來描述系統架構、資訊處理流程與複雜邏輯。圖像應作為溝通與文件的重要組成部分，以降低歧義並提升理解效率。

## 技術與實作標準 (Technical & Implementation Standards)

遵循專案既有的技術棧與架構模式。在引入新的第三方庫或技術前，必須評估其對效能與複雜度的影響。優先選擇輕量級、成熟且穩定的解決方案。所有代碼變更應保持架構的整潔與模組化。

## 開發與審查流程 (Development Workflow)

1.  **規格確認**: 實作前確保需求明確且符合 MVP 原則，複雜邏輯應輔以圖表說明。
2.  **測試與實作**: 遵循可測試性原則，確保新功能被測試覆蓋。
3.  **代碼審查**: Review 重點包括是否過度設計、是否符合 UX 一致性、以及是否符合正體中文規範。
4.  **持續整合**: 確保所有測試在合併前通過。

## 治理 (Governance)

本憲章為 P-Note 專案的最高指導原則。所有功能規格 (Spec)、計畫 (Plan) 與實作任務 (Task) 皆不得牴觸本憲章。
任何對原則的修改必須經過團隊討論，並依據版本號規則更新本文件。所有 PR 與設計文件必須明確展示如何符合上述原則。

**Version**: 1.1.0 | **Ratified**: 2026-02-01 | **Last Amended**: 2026-02-01