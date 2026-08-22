export type UserProfile = {
  name: string
  email?: string
  emailConfirmed?: boolean
  roles: string[]
  status: string
  createdAt?: string
}

export type AuthResponse = {
  access: string
  user: UserProfile
}

export type RefreshResponse = {
  access: string
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
