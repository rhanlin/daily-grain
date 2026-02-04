# Feature Specification: PWA Custom Logo Integration

**Feature Branch**: `009-pwa-custom-logo`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "請檢視目前 PWA 整合的狀況，我想要添加自行繪製的 LOGO 讓 PWA 下載到手機桌面時使用"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 自定義 PWA 桌面圖示 (Custom PWA Home Screen Icon) (Priority: P1)

使用者透過行動裝置瀏覽器進入應用程式時，可以選擇「新增至主螢幕」。安裝完成後，使用者的手機桌面上應顯示開發者自行繪製的自定義 LOGO，而非預設的 Vite 或 React 圖示。

**Why this priority**: 品牌識別與使用者體驗的核心，提供專業感與快速入口。

**Independent Test**: 在行動裝置（Android 或 iOS）上安裝 PWA，驗證桌面顯示的圖示為新設計的 LOGO。

**Acceptance Scenarios**:

1. **Given** 使用者在支援 PWA 的行動瀏覽器中開啟 App, **When** 點擊「新增至主螢幕」, **Then** 桌面應出現正確命名的應用程式與自定義圖示。
2. **Given** 應用程式已安裝至桌面, **When** 啟動 App, **Then** 啟動畫面 (Splash Screen) 應顯示正確的 LOGO 與背景顏色。

---

### User Story 2 - PWA 技術規範檢查 (PWA Manifest Health Check) (Priority: P2)

開發者在發佈更新後，需要確保 PWA 的 Manifest 檔案符合現代瀏覽器的要求，包括圖示尺寸、快取策略與基本中繼資料，確保安裝流程順暢。

**Why this priority**: 確保技術基礎穩健，避免因規範不符導致安裝失敗。

**Independent Test**: 使用 Google Lighthouse 或 DevTools 進行 PWA 審核，確認「安裝性」檢查項全數通過。

**Acceptance Scenarios**:

1. **Given** 開啟開發者工具的 PWA 面板, **When** 檢查 Manifest 選項, **Then** 所有圖示路徑應正確加載，且無錯誤提示。

---

## Requirements *(mandatory)*

### Clarifications
#### Session 2026-02-04
- Q: Application Display Name in Traditional Chinese? → A: DailyGrain
- Q: Replace browser favicon with custom logo? → A: Yes
- Q: PWA Theme Color? → A: #ffffff

### Functional Requirements

- **FR-001**: **清單檔案更新**: 系統必須更新 `manifest.webmanifest` (或 `manifest.json`)，將圖示路徑指向新的自定義 LOGO 資源。
- **FR-002**: **多尺寸支援**: 必須提供至少兩種尺寸的 PNG 圖示：192x192 (主要用於手機桌面) 與 512x512 (用於啟動畫面與大型視圖)。
- **FR-003**: **Android 遮罩圖示 (Maskable Icon)**: 必須提供支援遮罩 (maskable) 的圖示，以適應 Android 系統不同的形狀切換。
- **FR-004**: **iOS 觸控圖示支援**: 必須在 HTML 中正確配置 `apple-touch-icon`，確保 iOS 裝置能正確抓取桌面圖示。
- **FR-005**: **離線資源快取**: 確保 Service Worker 已將新的圖示資源納入預快取 (Pre-cache) 清單中。
- **FR-006**: **品牌資訊更新**: 將應用程式名稱更新為「DailyGrain」，並將瀏覽器 favicon 替換為自定義 LOGO。
- **FR-007**: **主題顏色配置**: PWA 主題顏色設定為 `#ffffff`。

### Key Entities

- **Web App Manifest**: 定義應用程式如何呈現給使用者的 JSON 檔案。
- **Service Worker**: 負責背景處理與離線支援的腳本。
- **App Assets**: 包含所有尺寸圖示的靜態資源資料夾。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 行動端（Android/iOS）桌面安裝圖示顯示正確率為 100%。
- **SC-002**: Google Lighthouse PWA 評分中，「Installable」檢查項獲得滿分。
- **SC-003**: 啟動畫面 (Splash Screen) 的加載時間在本地環境下低於 500ms。