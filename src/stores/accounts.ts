import { defineStore } from 'pinia'
import { ref } from 'vue'
import { accountsApi } from '@/api/accounts'
import type { Account, AccountFormDto, AccountsQuery } from '@/types'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(query?: AccountsQuery) {
    loading.value = true
    error.value = null
    try {
      const { data } = await accountsApi.getAll(query)
      accounts.value = data
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function create(dto: AccountFormDto): Promise<boolean> {
    try {
      const { data } = await accountsApi.create(dto)
      accounts.value.unshift(data)
      return true
    } catch (e) {
      error.value = (e as Error).message
      return false
    }
  }

  async function update(id: string, dto: AccountFormDto): Promise<boolean> {
    try {
      const { data } = await accountsApi.update(id, dto)
      const index = accounts.value.findIndex((a) => a.id === id)
      if (index !== -1) accounts.value[index] = data
      return true
    } catch (e) {
      error.value = (e as Error).message
      return false
    }
  }

  async function remove(id: string): Promise<boolean> {
    try {
      await accountsApi.remove(id)
      accounts.value = accounts.value.filter((a) => a.id !== id)
      return true
    } catch (e) {
      error.value = (e as Error).message
      return false
    }
  }

  return { accounts, loading, error, fetchAll, create, update, remove }
})
