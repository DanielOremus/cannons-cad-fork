import type { IncidentOrigin } from '../../types/incident/incident.origin.js';
import type { IncidentPriority } from '../../types/incident/incident.priority.js';
import type { IncidentStatus } from '../../types/incident/incident.status.js';
import type { UnitDto } from '../unit/get-unit.dto.js';

export type IncidentNoteDto = {
  id: number;
  text: string;
  author: string;
  createdAt: Date;
};

export type IncidentDto = {
  id: number;
  title: string;
  priority: IncidentPriority | null;
  origin: IncidentOrigin;
  status: IncidentStatus;
  code: string;
  address: string;
  postal: string | null;
  attachedUnits: UnitDto[];
  description: string | null;
  notes: IncidentNoteDto[];
};
