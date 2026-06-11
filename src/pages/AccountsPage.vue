<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import { useDebounce } from '@/composables/useDebounce'
import AccountFormModal from '@/components/AccountFormModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { RoleLevel, AccountStatus } from '@/types'
import type { Account, AccountFormDto } from '@/types'

const store = useAccountsStore()

// --- Search ---
const searchName = ref('')
const searchEmail = ref('')
const debouncedName = useDebounce(searchName)
const debouncedEmail = useDebounce(searchEmail)

watch([debouncedName, debouncedEmail], ([name, email]) => {
  store.fetchAll({ name: name || undefined, email: email || undefined })
})

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

// --- Helpers ---
const ROLE_BADGE: Record<RoleLevel, string> = {
  [RoleLevel.ADMIN]: 'bg-purple-100 text-purple-700',
  [RoleLevel.EDITOR]: 'bg-blue-100 text-blue-700',
  [RoleLevel.USER]: 'bg-green-100 text-green-700',
  [RoleLevel.CLIENT]: 'bg-orange-100 text-orange-700',
}
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-800">帳號列表</h1>
        <p class="text-sm text-gray-400 mt-0.5">管理所有系統帳號</p>
      </div>
      <button
        @click="openCreate"
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white
               bg-primary-600 hover:bg-primary-700 transition shadow-sm self-start sm:self-auto"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        新增帳號
      </button>
    </div>

    <!-- Search filters -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          v-model="searchName"
          type="text"
          placeholder="搜尋名稱..."
          class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none
                 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition"
        />
      </div>
      <div class="relative flex-1">
        <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </span>
        <input
          v-model="searchEmail"
          type="text"
          placeholder="搜尋電子郵件..."
          class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none
                 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition"
        />
      </div>
    </div>

    <!-- Error banner -->
    <div
      v-if="store.error"
      class="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2"
    >
      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ store.error }}
    </div>

    <!-- Table card -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <!-- Loading skeleton -->
      <div v-if="store.loading" class="p-8 flex items-center justify-center">
        <svg class="w-6 h-6 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span class="ml-3 text-sm text-gray-400">載入中...</span>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="store.accounts.length === 0"
        class="p-12 flex flex-col items-center text-center text-gray-400"
      >
        <svg class="w-12 h-12 mb-3 text-gray-200" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p class="text-sm font-medium">尚無帳號資料</p>
        <p class="text-xs mt-1">點擊「新增帳號」來建立第一筆資料</p>
      </div>

      <!-- Desktop table -->
      <div v-else class="hidden sm:block overflow-x-auto scrollbar-thin">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50 text-gray-500 text-xs font-medium uppercase tracking-wide">
              <th class="text-left px-5 py-3">名稱</th>
              <th class="text-left px-5 py-3">電子郵件</th>
              <th class="text-left px-5 py-3">角色</th>
              <th class="text-left px-5 py-3">狀態</th>
              <th class="text-right px-5 py-3">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="account in store.accounts"
              :key="account.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-5 py-3.5 font-medium text-gray-800">{{ account.name }}</td>
              <td class="px-5 py-3.5 text-gray-500">{{ account.email }}</td>
              <td class="px-5 py-3.5">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="ROLE_BADGE[account.roleLevel]"
                >
                  {{ account.roleLevel }}
                </span>
              </td>
              <td class="px-5 py-3.5">
                <span
                  class="inline-flex items-center gap-1.5 text-xs font-medium"
                  :class="account.status === AccountStatus.ON ? 'text-green-600' : 'text-gray-400'"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="account.status === AccountStatus.ON ? 'bg-green-500' : 'bg-gray-300'"
                  />
                  {{ account.status === AccountStatus.ON ? '啟用' : '停用' }}
                </span>
              </td>
              <td class="px-5 py-3.5">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEdit(account)"
                    class="px-3 py-1.5 rounded-lg text-xs font-medium text-primary-600 bg-primary-50
                           hover:bg-primary-100 transition"
                  >
                    編輯
                  </button>
                  <button
                    @click="openDelete(account)"
                    class="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50
                           hover:bg-red-100 transition"
                  >
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile card list -->
      <div v-if="!store.loading && store.accounts.length > 0" class="sm:hidden divide-y divide-gray-50">
        <div
          v-for="account in store.accounts"
          :key="account.id"
          class="px-4 py-4"
        >
          <div class="flex items-start justify-between mb-2">
            <div>
              <p class="font-medium text-gray-800 text-sm">{{ account.name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ account.email }}</p>
            </div>
            <span
              class="inline-flex items-center gap-1.5 text-xs font-medium mt-0.5"
              :class="account.status === AccountStatus.ON ? 'text-green-600' : 'text-gray-400'"
            >
              <span
                class="w-1.5 h-1.5 rounded-full"
                :class="account.status === AccountStatus.ON ? 'bg-green-500' : 'bg-gray-300'"
              />
              {{ account.status === AccountStatus.ON ? '啟用' : '停用' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span
              class="px-2.5 py-1 rounded-full text-xs font-medium"
              :class="ROLE_BADGE[account.roleLevel]"
            >
              {{ account.roleLevel }}
            </span>
            <div class="flex gap-2">
              <button
                @click="openEdit(account)"
                class="px-3 py-1.5 rounded-lg text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition"
              >
                編輯
              </button>
              <button
                @click="openDelete(account)"
                class="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 transition"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer count -->
    <p v-if="!store.loading" class="mt-3 text-xs text-gray-400 text-right">
      共 {{ store.accounts.length }} 筆資料
    </p>
  </div>

  <!-- Modals -->
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
