<script setup lang="ts">
import { AccountStatus, ROLE_LABEL } from '@/types'
import type { Account } from '@/types'

defineProps<{
  account: Account
  isAdmin: boolean
}>()

defineEmits<{
  edit: []
  delete: []
}>()

function displayDate(dateStr?: string): string {
  return dateStr ? dateStr.slice(0, 10) : '—'
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden flex flex-col">
    <!-- 卡片標題：頭像 + 姓名 + 狀態 -->
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

    <!-- 卡片資訊：信箱、角色、建立日期 -->
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

    <!-- 卡片操作：僅管理員可見 -->
    <div v-if="isAdmin" class="flex gap-2 px-4 py-3 border-t border-gray-100">
      <button
        @click="$emit('edit')"
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
        @click="$emit('delete')"
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
</template>
