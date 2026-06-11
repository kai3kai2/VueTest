<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { accountsApi } from '@/api/accounts'
import { RoleLevel, AccountStatus } from '@/types'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  roleLevel: RoleLevel.USER,
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const loading = ref(false)
const successMessage = ref('')
const apiError = ref('')

const ROLE_OPTIONS: { value: RoleLevel; label: string }[] = [
  { value: RoleLevel.USER, label: 'User' },
  { value: RoleLevel.CLIENT, label: 'Client' },
  { value: RoleLevel.EDITOR, label: 'Editor' },
  { value: RoleLevel.ADMIN, label: 'Admin' },
]

function validate(): boolean {
  errors.name = form.name.trim() ? '' : '請輸入姓名'
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ? ''
    : '請輸入有效的電子郵件'
  errors.password = form.password.length >= 6 ? '' : '密碼至少需要 6 個字元'
  errors.confirmPassword =
    form.password === form.confirmPassword ? '' : '兩次密碼輸入不一致'
  return !errors.name && !errors.email && !errors.password && !errors.confirmPassword
}

async function handleRegister() {
  if (!validate()) return

  loading.value = true
  apiError.value = ''
  try {
    await accountsApi.create({
      name: form.name,
      email: form.email,
      roleLevel: form.roleLevel,
      status: AccountStatus.ON,
    })
    successMessage.value = '註冊成功！即將跳轉至登入頁面...'
    setTimeout(() => router.push({ name: 'login' }), 1800)
  } catch (e) {
    apiError.value = (e as Error).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#eef0fb] flex flex-col items-center justify-center px-4">
    <div class="w-full max-w-[420px] bg-white rounded-2xl shadow-lg px-8 py-10">
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <div class="w-14 h-14 rounded-full bg-primary-600 flex items-center justify-center shadow-md">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
      </div>

      <!-- Heading -->
      <h1 class="text-center text-xl font-semibold text-gray-800 mb-1">建立帳號</h1>
      <p class="text-center text-sm text-gray-400 mb-7">填寫以下資料以完成註冊</p>

      <!-- Success message -->
      <div
        v-if="successMessage"
        class="mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2"
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {{ successMessage }}
      </div>

      <!-- API error -->
      <div
        v-if="apiError"
        class="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2"
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ apiError }}
      </div>

      <form v-if="!successMessage" @submit.prevent="handleRegister" novalidate class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">姓名</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              v-model="form.name"
              type="text"
              placeholder="請輸入姓名"
              autocomplete="name"
              class="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm outline-none transition
                     focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              :class="errors.name ? 'border-red-400' : 'border-gray-200'"
            />
          </div>
          <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">電子郵件</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              v-model="form.email"
              type="email"
              placeholder="your@email.com"
              autocomplete="email"
              class="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm outline-none transition
                     focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              :class="errors.email ? 'border-red-400' : 'border-gray-200'"
            />
          </div>
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
        </div>

        <!-- Role -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">角色</label>
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

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">密碼</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              v-model="form.password"
              type="password"
              placeholder="至少 6 個字元"
              autocomplete="new-password"
              class="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm outline-none transition
                     focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              :class="errors.password ? 'border-red-400' : 'border-gray-200'"
            />
          </div>
          <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">確認密碼</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="再次輸入密碼"
              autocomplete="new-password"
              class="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm outline-none transition
                     focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              :class="errors.confirmPassword ? 'border-red-400' : 'border-gray-200'"
            />
          </div>
          <p v-if="errors.confirmPassword" class="mt-1 text-xs text-red-500">{{ errors.confirmPassword }}</p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold
                 bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800
                 disabled:opacity-60 disabled:cursor-not-allowed transition mt-2"
        >
          <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ loading ? '註冊中...' : '立即註冊' }}
        </button>
      </form>
    </div>

    <!-- Back to login -->
    <p class="mt-6 text-sm text-gray-500">
      已有帳號？
      <RouterLink :to="{ name: 'login' }" class="text-primary-600 hover:underline font-medium">
        返回登入
      </RouterLink>
    </p>
  </div>
</template>
