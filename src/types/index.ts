export enum RoleLevel {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER',
  CLIENT = 'CLIENT',
}

export enum AccountStatus {
  ON = 'ON',
  OFF = 'OFF',
}

export interface AuthUser {
  email: string
}

export interface Account {
  id: string
  name: string
  email: string
  roleLevel: string
  status: string
  createdAt?: string
}

export interface AccountFormDto {
  name: string
  email: string
  roleLevel: string
  status: string
}

export interface AccountsQuery {
  name?: string
  email?: string
}

export const ROLE_OPTIONS: { value: RoleLevel; label: string }[] = [
  { value: RoleLevel.ADMIN, label: '管理員' },
  { value: RoleLevel.EDITOR, label: '編輯' },
  { value: RoleLevel.USER, label: '用戶' },
  { value: RoleLevel.CLIENT, label: '訪客' },
]

export const STATUS_OPTIONS: { value: AccountStatus; label: string }[] = [
  { value: AccountStatus.ON, label: '啟用' },
  { value: AccountStatus.OFF, label: '停用' },
]

export const ROLE_LABEL: Record<string, string> = Object.fromEntries(
  ROLE_OPTIONS.map(o => [o.value, o.label])
)

