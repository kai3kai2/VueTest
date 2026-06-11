import http from './index'
import type { Account, AccountFormDto, AccountsQuery } from '@/types'

export const accountsApi = {
  getAll(params?: AccountsQuery) {
    return http.get<Account[]>('/accounts', { params })
  },

  getById(id: string) {
    return http.get<Account>(`/account/${id}`)
  },

  create(data: AccountFormDto) {
    return http.post<Account>('/create-account', data)
  },

  update(id: string, data: AccountFormDto) {
    return http.patch<Account>(`/update-account/${id}`, data)
  },

  remove(id: string) {
    return http.delete(`/delete-account/${id}`)
  },
}
