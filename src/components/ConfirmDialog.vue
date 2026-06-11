<script setup lang="ts">
defineProps<{
  message: string
  loading?: boolean
}>()

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @mousedown.self="$emit('cancel')"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div class="flex items-start gap-4 mb-6">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-semibold text-gray-800 mb-1">確認刪除</h3>
            <p class="text-sm text-gray-500">{{ message }}</p>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button
            @click="$emit('cancel')"
            :disabled="loading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100
                   hover:bg-gray-200 transition disabled:opacity-50"
          >
            取消
          </button>
          <button
            @click="$emit('confirm')"
            :disabled="loading"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500
                   hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ loading ? '刪除中...' : '確認刪除' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
