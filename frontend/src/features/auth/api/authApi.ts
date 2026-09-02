import { apiRequest } from '../../../shared/api/appClient'
import {
  type AuthResponse,
  type ConfirmEmailRequest,
  type LoginRequest,
  type RefreshResponse,
  type RegisterRequest,
} from '../model/auth.types'

let refreshSessionPromise: Promise<RefreshResponse> | null = null

export function login(request: LoginRequest) {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: request,
    credentials: 'include',
  })
}

export function register(request: RegisterRequest) {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: request,
    credentials: 'include',
  })
}

export function confirmEmail(request: ConfirmEmailRequest, accessToken: string) {
  return apiRequest('/auth/confirm-email', {
    method: 'POST',
    body: request,
    token: accessToken,
    credentials: 'include',
  })
}

export function resendConfirmationCode(accessToken: string) {
  return apiRequest('/auth/resend-code', {
    method: 'POST',
    token: accessToken,
    credentials: 'include',
  })
}

export function refreshSession() {
  if (!refreshSessionPromise) {
    refreshSessionPromise = apiRequest<RefreshResponse>('/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      refreshSessionPromise = null
    })
  }

  return refreshSessionPromise
}

export function logout(accessToken: string) {
  return apiRequest('/auth/logout', {
    method: 'POST',
    token: accessToken,
    credentials: 'include',
  })
}
