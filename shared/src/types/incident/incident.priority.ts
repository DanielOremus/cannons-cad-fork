export const IncidentPriority = {
  CODE_3: '3',
  CODE_2H: '2H',
  CODE_2: '2',
  LOW: 'H',
} as const;

export type IncidentPriority = (typeof IncidentPriority)[keyof typeof IncidentPriority];
