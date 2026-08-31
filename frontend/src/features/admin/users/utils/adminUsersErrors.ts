import { ApiError } from '@/shared/api/apiError';

export function getAdminUsersErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}
