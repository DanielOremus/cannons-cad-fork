export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
} as const

export type Gender = (typeof Gender)[keyof typeof Gender]

export const CharacterFlag = {
  MENTAL_HEALTH: "MENTAL_HEALTH",
  BOLO: "BOLO",
  WARRANT: "WARRANT",
} as const

export type CharacterFlag = (typeof CharacterFlag)[keyof typeof CharacterFlag]
