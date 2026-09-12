import { DutyType, UnitStatus } from '@project/shared';
import { UnitDto } from '../../modules/unit/dto/get-unit.dto.js';

export const Events = {
  UNIT_STATUS_UPDATED: 'unit.status.updated',
  UNIT_UPDATED: 'unit.updated',
  INCIDENT_UPDATED: 'incident.updated',
  DUTY_ENDED: 'duty.ended',
  UNIT_CREATED: 'unit.created',
} as const;

type EventsMap = {
  [Events.UNIT_STATUS_UPDATED]: { status: UnitStatus; unitId: number };
  [Events.UNIT_UPDATED]: { id: number };
  [Events.INCIDENT_UPDATED]: { id: number };
  [Events.DUTY_ENDED]: { unit: object };
  [Events.UNIT_CREATED]: { unit: UnitDto; userId: string };
};

export type EventName = (typeof Events)[keyof typeof Events];

export type EventPayload<E extends EventName> = EventsMap[E];
