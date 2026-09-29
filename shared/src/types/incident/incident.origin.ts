export const IncidentOrigin = {
  CIVILIAN: 'CIVILIAN',
  OFFICER: 'OFFICER',
  ALARM: 'ALARM',
} as const;

export type IncidentOrigin = (typeof IncidentOrigin)[keyof typeof IncidentOrigin];
