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

export interface Account {
  id: string
  name: string
  email: string
  roleLevel: RoleLevel
  status: AccountStatus
  createdAt?: string
}

export interface AccountFormDto {
  name: string
  email: string
  roleLevel: RoleLevel
  status: AccountStatus
}

export interface AccountsQuery {
  name?: string
  email?: string
}

