<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = defineModel<string>('email', { default: '' })
const password = defineModel<string>('password', { default: '' })
const rememberMe = defineModel<boolean>('rememberMe', { default: false })

const loading = ref(false)
const emailError = ref('')
const passwordError = ref('')

const isEmailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value),
)

function validate(): boolean {
  emailError.value = ''
  passwordError.value = ''

  if (!email.value) {
    emailError.value = '請輸入電子郵件'
    return false
  }
  if (!isEmailValid.value) {
    emailError.value = '請輸入有效的電子郵件格式'
    return false
  }
  if (!password.value) {
    passwordError.value = '請輸入密碼'
    return false
  }
  if (password.value.length < 3) {
    passwordError.value = '密碼至少需要 3 個字元'
    return false
  }
  return true
}

async function handleLogin() {
  if (!validate()) return

  loading.value = true
  try {
    // Mock auth — API has no login endpoint
    await new Promise((r) => setTimeout(r, 600))
    auth.login(email.value, rememberMe.value)
    router.push({ name: 'accounts' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#eef0fb] flex flex-col items-center justify-center px-4">
    <!-- Login card -->
    <div class="w-full max-w-[420px] bg-white rounded-2xl shadow-lg px-8 py-10">
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <div class="w-14 h-14 rounded-full flex items-center justify-center shadow-md" style="background-color: oklch(0.511 0.262 276.966)">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Heading -->
      <h1 class="text-center text-xl font-semibold text-gray-800 mb-1">歡迎回來</h1>
      <p class="text-center text-sm text-gray-400 mb-7">請登入您的帳號以繼續</p>

      <form @submit.prevent="handleLogin" novalidate>
        <!-- Email -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">電子郵件</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              v-model="email"
              type="email"
              placeholder="your@email.com"
              autocomplete="email"
              class="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm outline-none transition
                     focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              :class="emailError ? 'border-red-400' : 'border-gray-200'"
            />
          </div>
          <p v-if="emailError" class="mt-1 text-xs text-red-500">{{ emailError }}</p>
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">密碼</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              class="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm outline-none transition
                     focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              :class="passwordError ? 'border-red-400' : 'border-gray-200'"
            />
          </div>
          <p v-if="passwordError" class="mt-1 text-xs text-red-500">{{ passwordError }}</p>
        </div>

        <!-- Remember me + Forgot password -->
        <div class="flex items-center justify-between mb-6">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input v-model="rememberMe" type="checkbox" class="w-4 h-4 accent-primary-600 rounded" />
            <span class="text-sm text-gray-600">記住我</span>
          </label>
          <a href="#" class="text-sm hover:underline" style="color: oklch(0.511 0.262 276.966)">忘記密碼？</a>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold
                 text-white disabled:opacity-60 disabled:cursor-not-allowed transition"
          style="background-color: oklch(0.511 0.262 276.966)"
        >
          <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ loading ? '登入中...' : '登入' }}
        </button>

        <!-- Hint -->
        <div class="mt-4 px-6 py-4 rounded-lg text-sm flex items-start gap-2" style="background-color: oklch(0.882 0.059 254.128); color: oklch(0.424 0.199 265.638)">
          <span>💡</span>
          <span>提示：輸入任意電子郵件和密碼即可登入</span>
        </div>
      </form>
    </div>

    <!-- Register link -->
    <p class="mt-6 text-sm text-gray-500">
      還沒有帳號？
      <RouterLink :to="{ name: 'register' }" class="hover:underline font-medium" style="color: oklch(0.511 0.262 276.966)">立即註冊</RouterLink>
    </p>
  </div>
</template>
