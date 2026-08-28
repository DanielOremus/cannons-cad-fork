export const SortOrder = ['asc', 'desc'] as const;

export type SortOrder = (typeof SortOrder)[number];
