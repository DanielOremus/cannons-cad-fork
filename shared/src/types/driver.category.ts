export const DriverCategory = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
} as const;

export type DriverCategory =
  (typeof DriverCategory)[keyof typeof DriverCategory];
