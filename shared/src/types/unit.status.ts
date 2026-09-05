export const UnitStatus = {
  AVAILABLE: 'AV',
  BUSY: 'BS',
  OFF_SERVICE: 'OS',
  ON_SCENE: 'SC',
} as const;

export type UnitStatus = (typeof UnitStatus)[keyof typeof UnitStatus];
