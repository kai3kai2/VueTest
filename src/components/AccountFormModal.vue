<script setup lang="ts">
import { reactive, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import { RoleLevel, AccountStatus } from '@/types'
import type { Account, AccountFormDto } from '@/types'

const props = defineProps<{
  account?: Account | null
  loading?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [dto: AccountFormDto]
}>()

const ROLE_OPTIONS: { value: RoleLevel; label: string }[] = [
  { value: RoleLevel.ADMIN, label: 'Admin' },
  { value: RoleLevel.EDITOR, label: 'Editor' },
  { value: RoleLevel.USER, label: 'User' },
  { value: RoleLevel.CLIENT, label: 'Client' },
]

const STATUS_OPTIONS: { value: AccountStatus; label: string }[] = [
  { value: AccountStatus.ON, label: '啟用' },
  { value: AccountStatus.OFF, label: '停用' },
]

const form = reactive<AccountFormDto>({
  name: '',
  email: '',
  roleLevel: RoleLevel.USER,
  status: AccountStatus.ON,
})

const errors = reactive({ name: '', email: '' })

// Populate form when editing an existing account
watch(
  () => props.account,
  (val) => {
    if (val) {
      form.name = val.name
      form.email = val.email
      form.roleLevel = val.roleLevel
      form.status = val.status
    } else {
      form.name = ''
      form.email = ''
      form.roleLevel = RoleLevel.USER
      form.status = AccountStatus.ON
    }
    errors.name = ''
    errors.email = ''
  },
  { immediate: true },
)

function validate(): boolean {
  errors.name = form.name.trim() ? '' : '請輸入名稱'
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : '請輸入有效的電子郵件'
  return !errors.name && !errors.email
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', { ...form })
}
</script>

<template>
  <BaseModal
    :title="account ? '編輯帳號' : '新增帳號'"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">名稱</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="請輸入名稱"
          class="w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition
                 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          :class="errors.name ? 'border-red-400' : 'border-gray-200'"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">電子郵件</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="example@email.com"
          class="w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition
                 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          :class="errors.email ? 'border-red-400' : 'border-gray-200'"
        />
        <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
      </div>

      <!-- Role Level -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">角色等級</label>
        <select
          v-model="form.roleLevel"
          class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none transition
                 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white"
        >
          <option v-for="opt in ROLE_OPTIONS" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <!-- Status -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">狀態</label>
        <div class="flex gap-4">
          <label
            v-for="opt in STATUS_OPTIONS"
            :key="opt.value"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              v-model="form.status"
              type="radio"
              :value="opt.value"
              class="accent-primary-600"
            />
            <span class="text-sm text-gray-700">{{ opt.label }}</span>
          </label>
        </div>
      </div>
    </form>

    <template #footer>
      <button
        @click="emit('close')"
        :disabled="loading"
        class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100
               hover:bg-gray-200 transition disabled:opacity-50"
      >
        取消
      </button>
      <button
        @click="handleSubmit"
        :disabled="loading"
        class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary-600
               hover:bg-primary-700 transition disabled:opacity-50 flex items-center gap-2"
      >
        <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ loading ? '儲存中...' : (account ? '更新' : '新增') }}
      </button>
    </template>
  </BaseModal>
</template>
