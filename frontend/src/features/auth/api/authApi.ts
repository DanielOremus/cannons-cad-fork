import { apiRequest } from '../../../shared/api/appClient'
import {
  type AuthResponse,
  type ConfirmEmailRequest,
  type LoginRequest,
  type RefreshResponse,
  type RegisterRequest,
} from '../model/auth.types'

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
  return apiRequest<void>('/auth/confirm-email', {
    method: 'POST',
    body: request,
    token: accessToken,
    credentials: 'include',
  })
}

export function resendConfirmationCode(accessToken: string) {
  return apiRequest<void>('/auth/resend-code', {
    method: 'POST',
    token: accessToken,
    credentials: 'include',
  })
}

export function refreshSession() {
  return apiRequest<RefreshResponse>('/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })
}

export function logout(accessToken: string) {
  return apiRequest<void>('/auth/logout', {
    method: 'POST',
    token: accessToken,
    credentials: 'include',
  })
}
