export const VehicleType = {
  SEDAN: 'SEDAN',
  COUPE: 'COUPE',
  SUV: 'SUV',
  TRUCK: 'TRUCK',
  OFFROAD: 'OFFROAD',
  MARINE: 'MARINE',
  MOTORCYCLE: 'MOTORCYCLE',
  AIRCRAFT: 'AIRCRAFT',
} as const;

export type VehicleType = (typeof VehicleType)[keyof typeof VehicleType];
