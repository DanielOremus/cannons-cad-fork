export const DutyType = {
  POLICE: 'police',
  DISPATCH: 'dispatch',
  CIVILIAN: 'civilian',
} as const;

export type DutyType = (typeof DutyType)[keyof typeof DutyType];
