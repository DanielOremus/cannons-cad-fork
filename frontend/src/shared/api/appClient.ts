import axios from 'axios'
import { ApiError, normalizeApiError } from './apiError'

type ApiRequestOptions = {
  body?: unknown
  method?: string
  token?: string
  credentials?: RequestCredentials
}

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
const apiBaseUrl = configuredBaseUrl.replace(/\/$/, '')

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
})

export function apiRequest(path: string, options?: ApiRequestOptions): Promise<void>
export function apiRequest<TResponse>(
  path: string,
  options?: ApiRequestOptions,
): Promise<TResponse>
export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse | void> {
  const headers: Record<string, string> = {}

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  try {
    const response = await apiClient.request<TResponse>({
      url: path,
      method: options.method ?? 'GET',
      data: options.body,
      headers,
      withCredentials: (options.credentials ?? 'include') !== 'omit',
    })

    if (response.status === 204 || response.data === '') {
      return
    }

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new ApiError(normalizeApiError(error.response.status, error.response.data))
      }

      throw new ApiError({
        status: 0,
        code: 'NETWORK_ERROR',
        message: 'The server could not be reached. Please try again.',
        issues: [],
      })
    }

    throw new ApiError({
      status: 0,
      code: 'REQUEST_FAILED',
      message: 'The request could not be completed.',
      issues: [],
    })
  }
}
