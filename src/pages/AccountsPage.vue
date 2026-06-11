<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import { useAuthStore } from '@/stores/auth'
import { useDebounce } from '@/composables/useDebounce'
import AccountCard from '@/components/AccountCard.vue'
import AccountFormModal from '@/components/AccountFormModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { AccountStatus, RoleLevel, ROLE_LABEL } from '@/types'
import type { Account, AccountFormDto } from '@/types'

const store = useAccountsStore()
const auth = useAuthStore()

// 依登入者 email 比對帳號清單，確認是否為管理員
const isAdmin = computed(() =>
  store.accounts.some(
    a => a.email === auth.user?.email && a.roleLevel === RoleLevel.ADMIN
  )
)

const searchQuery = ref('')
const debouncedQuery = useDebounce(searchQuery)

const filtered = computed(() => {
  const q = debouncedQuery.value.trim().toLowerCase()
  if (!q) return store.accounts
  return store.accounts.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.email.toLowerCase().includes(q) ||
    ROLE_LABEL[a.roleLevel].toLowerCase().includes(q),
  )
})

const totalCount = computed(() => store.accounts.length)
const activeCount = computed(() => store.accounts.filter(a => a.status === AccountStatus.ON).length)
const inactiveCount = computed(() => totalCount.value - activeCount.value)

onMounted(() => store.fetchAll())

// 新增 / 編輯 Modal
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

// 刪除確認 Dialog
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

    <!-- 搜尋列 + 新增按鈕 -->
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

    <!-- 統計卡片 -->
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

    <!-- 錯誤提示 -->
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

    <!-- 載入中 -->
    <div v-if="store.loading" class="flex items-center justify-center py-16">
      <svg class="w-6 h-6 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span class="ml-3 text-sm text-gray-400">載入中...</span>
    </div>

    <!-- 空狀態 -->
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

    <!-- 帳號卡片列表 -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AccountCard
        v-for="account in filtered"
        :key="account.id"
        :account="account"
        :is-admin="isAdmin"
        @edit="openEdit(account)"
        @delete="openDelete(account)"
      />
    </div>
  </div>

  <AccountFormModal
    v-if="showForm"
    :account="editTarget"
    :loading="formLoading"
    :existing-accounts="store.accounts"
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
