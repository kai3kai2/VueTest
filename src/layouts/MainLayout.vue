<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const router = useRouter()
const auth = useAuthStore()
const showLogoutConfirm = ref(false)
const loggingOut = ref(false)

async function confirmLogout() {
  loggingOut.value = true
  await new Promise((r) => setTimeout(r, 500))
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-[#eef0fb] flex flex-col">
    <!-- Top navbar -->
    <header class="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        <!-- Logo + title -->
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="font-semibold text-gray-800 text-sm leading-tight truncate">帳號管理系統</p>
            <p class="text-xs text-gray-400 leading-tight">管理您的所有帳號</p>
          </div>
        </div>

        <!-- Right: profile + logout -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <!-- User info (hidden on very small screens) -->
          <div class="hidden sm:flex flex-col items-end leading-tight">
            <span class="text-xs font-medium text-gray-700 truncate max-w-[180px]">歡迎! {{ auth.user?.email }}</span>
          </div>

          <button
            @click="showLogoutConfirm = true"
            :disabled="loggingOut"
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600
                   hover:bg-red-50 hover:text-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loggingOut" class="w-4 h-4 flex-shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <svg v-else class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="xs:inline">{{ loggingOut ? '登出中...' : '登出' }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1 p-4 sm:p-6">
      <RouterView />
    </main>
  </div>

  <ConfirmDialog
    v-if="showLogoutConfirm"
    message="確定要登出嗎？"
    :loading="loggingOut"
    @confirm="confirmLogout"
    @cancel="showLogoutConfirm = false"
  />
</template>
