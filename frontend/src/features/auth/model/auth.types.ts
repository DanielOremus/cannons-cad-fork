import type {
  UserRole as UserRoleType,
  UserStatus as UserStatusType,
} from '@project/shared'

export type UserProfile = {
  id?: string
  name: string
  email?: string
  emailConfirmed?: boolean
  roles: UserRoleType[]
  status: UserStatusType
  createdAt?: string
}

export type AuthResponse = {
  access: string
  user: UserProfile
}

export type RefreshResponse = {
  access: string
  user: UserProfile
}

export type LoginRequest = {
  email: string
  password: string
  captchaToken: string
}

export type RegisterRequest = {
  name: string
  email: string
  password: string
  confirmPassword: string
  captchaToken: string
}

export type ConfirmEmailRequest = {
  code: string
}
