<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import AccountFormModal from '@/components/AccountFormModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { RoleLevel, AccountStatus } from '@/types'
import type { Account, AccountFormDto } from '@/types'

const store = useAccountsStore()

const searchQuery = ref('')

function displayDate(dateStr?: string): string {
  return dateStr ? dateStr.slice(0, 10) : '—'
}

const ROLE_LABEL: Record<RoleLevel, string> = {
  [RoleLevel.ADMIN]: '管理員',
  [RoleLevel.EDITOR]: '編輯',
  [RoleLevel.USER]: '用戶',
  [RoleLevel.CLIENT]: '訪客',
}

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return store.accounts
  return store.accounts.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.email.toLowerCase().includes(q) ||
    ROLE_LABEL[a.roleLevel].toLowerCase().includes(q),
  )
})

const totalCount = computed(() => store.accounts.length)
const activeCount = computed(() => store.accounts.filter(a => a.status === AccountStatus.ON).length)
const inactiveCount = computed(() => store.accounts.filter(a => a.status === AccountStatus.OFF).length)

onMounted(() => store.fetchAll())

// --- Create / Edit modal ---
const showForm = ref(false)
const editTarget = ref<Account | null>(null)
const formLoading = ref(false)

function openCreate() {
  editTarget.value = null
  showForm.value = true
}

function openEdit(account: Account) {
  editTarget.value = account
  showForm.value = true
}

async function handleFormSubmit(dto: AccountFormDto) {
  formLoading.value = true
  const ok = editTarget.value
    ? await store.update(editTarget.value.id, dto)
    : await store.create(dto)
  formLoading.value = false
  if (ok) showForm.value = false
}

// --- Delete confirm ---
const showConfirm = ref(false)
const deleteTarget = ref<Account | null>(null)
const deleteLoading = ref(false)

function openDelete(account: Account) {
  deleteTarget.value = account
  showConfirm.value = true
}

async function handleDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  const ok = await store.remove(deleteTarget.value.id)
  deleteLoading.value = false
  if (ok) showConfirm.value = false
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-4">

    <!-- Search + New button -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <span class="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜尋帳號（姓名、郵件、角色）..."
          class="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none
                 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition shadow-sm"
        />
      </div>
      <button
        @click="openCreate"
        class="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white
               bg-primary-600 hover:bg-primary-700 active:bg-primary-800 transition shadow-sm shrink-0"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        新增帳號
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
        <p class="text-xs text-gray-400 mb-1">總帳號數</p>
        <p class="text-2xl font-semibold text-gray-800">{{ totalCount }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
        <p class="text-xs text-gray-400 mb-1">啟用中</p>
        <p class="text-2xl font-semibold text-gray-800">{{ activeCount }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
        <p class="text-xs text-primary-600 mb-1">已停用</p>
        <p class="text-2xl font-semibold text-primary-600">{{ inactiveCount }}</p>
      </div>
    </div>

    <!-- Error banner -->
    <div
      v-if="store.error"
      class="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2"
    >
      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ store.error }}
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="flex items-center justify-center py-16">
      <svg class="w-6 h-6 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span class="ml-3 text-sm text-gray-400">載入中...</span>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="filtered.length === 0"
      class="flex flex-col items-center py-16 text-gray-400"
    >
      <svg class="w-12 h-12 mb-3 text-gray-200" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <p class="text-sm font-medium">{{ searchQuery ? '找不到符合的帳號' : '尚無帳號資料' }}</p>
      <p v-if="!searchQuery" class="text-xs mt-1">點擊「新增帳號」來建立第一筆資料</p>
    </div>

    <!-- Account card grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="account in filtered"
        :key="account.id"
        class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
      >
        <!-- Card header: avatar + name + status -->
        <div class="flex items-start gap-3 px-5 pt-5 pb-3">
          <div class="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0 pt-0.5">
            <p class="font-semibold text-gray-800 text-sm truncate">{{ account.name }}</p>
            <span
              class="inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="account.status === AccountStatus.ON
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'"
            >
              {{ account.status === AccountStatus.ON ? '啟用' : '停用' }}
            </span>
          </div>
        </div>

        <!-- Card details -->
        <div class="px-5 pb-4 space-y-2 flex-1">
          <div class="flex items-center gap-2 text-sm text-gray-500 min-w-0">
            <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="truncate">{{ account.email }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{{ ROLE_LABEL[account.roleLevel] }}</span>
          </div>
          <div v-if="account.createdAt" class="flex items-center gap-2 text-sm text-gray-500">
            <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ displayDate(account.createdAt) }}</span>
          </div>
        </div>

        <!-- Card actions -->
        <div class="flex gap-2 px-4 py-3 border-t border-gray-100">
          <button
            @click="openEdit(account)"
            class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
                   text-primary-600 bg-primary-50 hover:bg-primary-100 transition"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            編輯
          </button>
          <button
            @click="openDelete(account)"
            class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
                   text-red-500 bg-red-50 hover:bg-red-100 transition"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            刪除
          </button>
        </div>
      </div>
    </div>
  </div>

  <AccountFormModal
    v-if="showForm"
    :account="editTarget"
    :loading="formLoading"
    @close="showForm = false"
    @submit="handleFormSubmit"
  />

  <ConfirmDialog
    v-if="showConfirm"
    :message="`確定要刪除「${deleteTarget?.name}」帳號嗎？此操作無法復原。`"
    :loading="deleteLoading"
    @confirm="handleDelete"
    @cancel="showConfirm = false"
  />
</template>
