---
description: "Task list for PWA Custom Logo Integration"
---

# 任務：PWA 自定義 LOGO 整合

**輸入**: 來自 `/specs/009-pwa-custom-logo/` 的設計文件
**先決條件**: plan.md (必要), spec.md (使用者故事必要), research.md, data-model.md.

**架構**: Vite, vite-plugin-pwa.
**前端**: PWA Manifest 與靜態資源配置。
**測試**: Google Lighthouse, Chrome DevTools Application Panel。

## 第一階段：環境準備 (Setup)

**目的**: 建立資源目錄並驗證 PWA 插件狀態。

- [x] T001 建立 PWA 圖示專用目錄 `public/icons/`
- [x] T002 驗證 `package.json` 中已安裝 `vite-plugin-pwa` 依賴

---

## 第二階段：基礎資源準備 (Foundational)

**目的**: 放置自定義圖示資源。

**⚠️ 關鍵**: 使用者需提供自行繪製的 LOGO 檔案並放置於指定路徑。

- [x] T003 放置 192x192 圖示至 `public/icons/icon-192x192.webp`
- [x] T004 放置 512x512 圖示至 `public/icons/icon-512x512.webp`
- [x] T005 放置遮罩式圖示至 `public/icons/maskable-icon.webp` (需包含安全區域)
- [x] T006 放置 iOS 觸控圖示至 `public/icons/apple-touch-icon.webp` (180x180)

---

## 第三階段：使用者故事 1 - 自定義 PWA 桌面圖示 (Priority: P1) 🎯 MVP

**目標**: 更新配置使 PWA 使用新的自定義 LOGO。

**獨立測試**: 執行 `npm run build` 並檢查 `dist/manifest.webmanifest` 中的圖示路徑。

### 使用者故事 1 實作

- [x] T007 更新 `vite.config.ts` 中的 `VitePWA` 配置，將 `manifest.icons` 指向新的 `public/icons/` 路徑
- [x] T008 在 `vite.config.ts` 的 `includeAssets` 中加入新的圖示路徑
- [x] T009 在 `vite.config.ts` 中為 Android 增加 `purpose: 'maskable'` 屬性至對應圖示配置
- [x] T010 修改 `index.html`，在 `<head>` 中加入 `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.webp">`

**檢查點**: 靜態配置已完成，Manifest 已正確引用自定義資源。

---

## 第四階段：使用者故事 2 - PWA 技術規範檢查 (Priority: P2)

**目標**: 確保 PWA 符合現代瀏覽器的安裝規範。

**獨立測試**: 使用 Chrome DevTools 的 Application 面板檢查 Manifest 是否加載成功且圖示無遺漏。

### 使用者故事 2 實作

- [x] T011 執行本地構建 `npm run build` 並驗證生成物中包含所有圖示資源
- [x] T012 使用 Lighthouse 進行 PWA 審核，確保 "Installable" 檢查項全數通過

**檢查點**: 應用程式已具備完整安裝性，且啟動畫面顯示正確。

---

## 第五階段：細節優化與清理 (Polish)

**目的**: 清理舊有資源並優化元數據。

- [x] T013 移除 `public/` 根目錄下不再使用的舊版 PWA 圖示 (如 `pwa-192x192.webp`)
- [x] T014 更新 `manifest` 中的 `name` 與 `description` 為規格書定義的正體中文內容

---

## 依賴關係與執行順序

### 階段依賴

- **環境準備 (Phase 1)**: 無依賴 - 可立即開始。
- **基礎資源 (Phase 2)**: 依賴 Phase 1 建立目錄。
- **實作 (Phase 3)**: 依賴 Phase 2 資源到位。
- **驗證 (Phase 4)**: 依賴 Phase 3 完成配置與構建。
- **清理 (Phase 5)**: 依賴 Phase 4 驗證通過。

### 並行機會

- T003 至 T006 可由使用者同時準備。
- T007 至 T010 可以在資源放置的同時進行配置代碼編寫。

---

## 實作策略

### MVP 優先 (使用者故事 1)

1. 確保圖示資源正確放置於 `public/icons/`。
2. 更新 `vite.config.ts` 使 Manifest 生效。
3. **驗證**: 確保在開發者工具中能看到新的圖示預覽。

### 漸進式交付

1. 先完成基本的圖示替換。
2. 隨後優化 Android 遮罩效果與 iOS 特殊配置。
3. 最後進行全方位的 PWA 健康檢查。
