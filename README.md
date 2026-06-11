# Account Manager — Vue 前端面試測驗

A Vue 3 + TypeScript + Tailwind CSS account management app built for the Mercury Engineering frontend interview.

## Tech Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Vite 8** — build tool
- **TypeScript** — full type coverage
- **Tailwind CSS v3** — utility-first styling, responsive design
- **Pinia** — state management
- **Vue Router 4** — client-side routing with navigation guards
- **Axios** — HTTP client with request/response interceptors

## Features

- Login page (mock auth — any valid email + password)
- Accounts list with real-time debounced search (name / email)
- Create, edit, and delete accounts via modal dialogs
- Role level and status badges
- Responsive layout (sidebar on desktop, hamburger on mobile)
- Loading and error states throughout
- `interviewerName` header injected on every API request

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set your English name:

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=https://api-frontend-interview-server.metcfire.com.tw
VITE_INTERVIEWER_NAME=YourEnglishName
```

### 3. Start development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## Project Structure

```
src/
├── api/              # axios instance + per-resource API modules
├── composables/      # useDebounce
├── layouts/          # MainLayout (sidebar + header)
├── pages/            # LoginPage, AccountsPage
├── components/       # BaseModal, AccountFormModal, ConfirmDialog
├── router/           # Vue Router config with auth guards
├── stores/           # Pinia stores: auth, accounts
└── types/            # TypeScript interfaces, enums
```
