import { DutyType, UnitStatus } from '@project/shared';

export const Events = {
  UNIT_STATUS_UPDATED: 'unit.status.updated',
  UNIT_UPDATED: 'unit.updated',
  INCIDENT_UPDATED: 'incident.updated',
  DUTY_STARTED: 'duty.started',
} as const;

type EventsMap = {
  [Events.UNIT_STATUS_UPDATED]: { status: UnitStatus; id: number };
  [Events.UNIT_UPDATED]: { id: number };
  [Events.INCIDENT_UPDATED]: { id: number };
  [Events.DUTY_STARTED]: { duty: DutyType; unit: object };
};

export type EventName = (typeof Events)[keyof typeof Events];

export type EventPayload<E extends EventName> = EventsMap[E];
