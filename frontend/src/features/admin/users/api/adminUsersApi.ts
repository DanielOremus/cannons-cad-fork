import { apiRequest } from '@/shared/api/appClient';
import type {
  AdminUserUpdate,
  AdminUsersQuery,
  AdminUsersResponse,
} from '../model/adminUsers.types';

function buildUsersPath(query: AdminUsersQuery) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }

  const search = params.toString();
  return search ? `/users?${search}` : '/users';
}

export function getAdminUsers(query: AdminUsersQuery, accessToken: string) {
  return apiRequest<AdminUsersResponse>(buildUsersPath(query), {
    token: accessToken,
    credentials: 'include',
  });
}

export function updateAdminUser(
  userId: string,
  update: AdminUserUpdate,
  accessToken: string,
) {
  return apiRequest(`/users/${userId}`, {
    method: 'PATCH',
    body: update,
    token: accessToken,
    credentials: 'include',
  });
}
