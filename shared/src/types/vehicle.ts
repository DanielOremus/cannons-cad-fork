export const VehicleFlag = {
  STOLEN: "STOLEN",
  IMPOUNDED: "IMPOUNDED",
  BOLO: "BOLO",
} as const

export type VehicleFlag = (typeof VehicleFlag)[keyof typeof VehicleFlag]
