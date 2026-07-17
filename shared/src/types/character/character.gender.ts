export const CharacterGender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
} as const;

export type CharacterGender =
  (typeof CharacterGender)[keyof typeof CharacterGender];
