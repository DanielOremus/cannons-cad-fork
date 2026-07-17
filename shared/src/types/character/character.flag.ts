export const CharacterFlag = {
  MENTAL_HEALTH: 'MENTAL_HEALTH',
  BOLO: 'BOLO',
  WARRANT: 'WARRANT',
} as const;

export type CharacterFlag = (typeof CharacterFlag)[keyof typeof CharacterFlag];
