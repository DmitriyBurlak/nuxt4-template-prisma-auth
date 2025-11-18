import type { RoleUsersEnum } from './enum'

export declare namespace USERS {
  interface UserBase {
    id: string
    email: string
    fullname: string
    phone: string | null
    avatar: string | null
		createdAt: string | Date | null
    roles?: RoleUsersEnum[]
  }
}