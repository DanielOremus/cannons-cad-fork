import type {
  GetUsersQueryDto,
  PaginatedList,
  SortOrder as SortOrderType,
  PublicUserResponseDto,
  UpdateUserDto,
  UserRole as UserRoleType,
  UserSortOption as UserSortOptionType,
  UserStatus as UserStatusType,
} from '@project/shared';
import { SortOrder, UserRole, UserSortOption, UserStatus } from '@project/shared';

export type AdminUser = PublicUserResponseDto;
export type AdminUsersResponse = PaginatedList<AdminUser>;
export type AdminUsersQuery = Partial<GetUsersQueryDto>;
export type AdminUserUpdate = UpdateUserDto;
export type AdminUserRole = UserRoleType;
export type AdminUserStatus = UserStatusType;
export type AdminUserSortOption = UserSortOptionType;
export type AdminSortOrder = SortOrderType;
export type AdminStatusFilter = AdminUserStatus | 'all';

export const USER_ROLE_OPTIONS = Object.values(UserRole) as AdminUserRole[];
export const USER_STATUS_OPTIONS = Object.values(UserStatus) as AdminUserStatus[];
export const USER_SORT_OPTIONS = [...UserSortOption] as AdminUserSortOption[];
export const SORT_ORDER_OPTIONS = [...SortOrder] as AdminSortOrder[];
