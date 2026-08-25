export const CitationStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  CLOSED: 'CLOSED',
} as const;

export type CitationStatus = (typeof CitationStatus)[keyof typeof CitationStatus];
