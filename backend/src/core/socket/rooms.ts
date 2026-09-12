export const Rooms = {
  unit: (id: number) => `unit:${id}`,
  unitMember: (id: number) => `unit-member:${id}`,
  police: 'police',
  ems: 'ems',
  dispatch: `dispatch`,
} as const;
