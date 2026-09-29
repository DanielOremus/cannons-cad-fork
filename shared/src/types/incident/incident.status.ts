export const IncidentStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
} as const;

export type IncidentStatus = (typeof IncidentStatus)[keyof typeof IncidentStatus];
