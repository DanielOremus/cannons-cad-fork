export const LicenseCategory = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
} as const

export type LicenseCategory = (typeof LicenseCategory)[keyof typeof LicenseCategory]
