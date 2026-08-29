export const UserSortOption = ['name', 'status', 'createdAt'] as const;

export type UserSortOption = (typeof UserSortOption)[number];
