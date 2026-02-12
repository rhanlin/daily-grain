# Quickstart: Husky Git Hooks Verification

## 1. 初始設定 (Setup)
確保已安裝依賴並初始化 Husky：
```bash
npm install
npx husky init
```

## 2. 驗證 Lint-staged (US1 & FR-006)
1. 故意修改一個檔案，加入未使用的變數（違反 ESLint 規則）。
2. 將檔案加入暫存區：`git add .`。
3. 執行提交：`git commit -m "test: test lint-staged"`。
4. **預期結果**: 提交應失敗，並顯示 ESLint 報錯資訊。

## 3. 驗證 Build Guard (US1 & FR-003)
1. 故意在 TypeScript 檔案中加入類型錯誤。
2. 將檔案加入暫存區並提交。
3. **預期結果**: `lint-staged` 可能通過（若無語法錯誤），但 `npm run build` 應攔截該提交並顯示類型錯誤。

## 4. 正常流程驗證
1. 修復所有錯誤。
2. 執行提交。
3. **預期結果**: 完成 Lint 與 Build 檢查後，順利產生 Commit 物件。
