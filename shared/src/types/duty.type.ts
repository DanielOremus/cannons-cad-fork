export const DutyType = {
  POLICE: 'police',
  DISPATCH: 'dispatch',
  ADMIN: 'admin',
  CIVILIAN: 'civilian',
  EMS: 'ems',
} as const;

export const LiveDuty = [DutyType.POLICE, DutyType.DISPATCH, DutyType.EMS] as const;
export const StaticDuty = [DutyType.ADMIN, DutyType.CIVILIAN] as const;

export type DutyType = (typeof DutyType)[keyof typeof DutyType];
export type LiveDuty = (typeof LiveDuty)[number];
