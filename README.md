# 帳號管理系統 — Vue 前端面試測驗

基於 Vue 3 + TypeScript + Tailwind CSS 所建立的帳號管理應用程式，為 Mercury Engineering 前端面試所開發。

## 技術棧

- **Vue 3**
- **Vite 6**
- **TypeScript**
- **Tailwind CSS v3**
- **Pinia**
- **Vue Router 4**
- **Axios**

## 功能特色

- 登入頁面（先註冊後登入即可）
- 帳號列表，支援即時防抖搜尋（依姓名 / Email）
- 透過 Modal 對話框新增、編輯及刪除帳號
- 角色等級與狀態標籤
- 響應式版面
- 全頁面的載入中與錯誤狀態處理

## 快速開始

### 1. 安裝套件

```bash
npm install
```

### 2. 設定環境變數

將 `.env.example` 複製為 `.env`，並填入你的英文姓名及API網站：

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=your_api_base_url
VITE_INTERVIEWER_NAME=YourEnglishName
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

## 專案結構

```
src/
├── api/              # axios 實例及各資源的 API 模組
├── composables/      # useDebounce
├── layouts/          # MainLayout（側邊欄 + 頁首）
├── pages/            # LoginPage、AccountsPage
├── components/       # BaseModal、AccountFormModal、ConfirmDialog
├── router/           # Vue Router 設定，含驗證守衛
├── stores/           # Pinia 狀態管理：auth、accounts
└── types/            # TypeScript 介面與列舉
```
