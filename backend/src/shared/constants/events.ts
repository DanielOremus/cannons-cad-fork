import { DutyType, LiveDuty, UnitStatus } from '@project/shared';
import { UnitDto } from '../../modules/unit/dto/get-unit.dto.js';

export const Events = {
  UNIT_STATUS_UPDATED: 'unit.status.updated',
  UNIT_UPDATED: 'unit.updated',
  INCIDENT_UPDATED: 'incident.updated',
  DUTY_ENDED: 'duty.ended',
  UNIT_CREATED: 'unit.created',
  UNIT_JOIN_SENT: 'unit.join.sent',
  UNIT_JOIN_ACCEPTED: 'unit.join.accepted',
  UNIT_JOIN_DECLINED: 'unit.join.declined',
} as const;

type EventsMap = {
  [Events.UNIT_STATUS_UPDATED]: { status: UnitStatus; unitId: number };
  [Events.UNIT_UPDATED]: { id: number };
  [Events.INCIDENT_UPDATED]: { id: number };
  [Events.DUTY_ENDED]: { unit: object };
  [Events.UNIT_CREATED]: { unit: UnitDto; userId: string };
  [Events.UNIT_JOIN_SENT]: {
    requestId: string;
    fromUser: {
      id: string;
      name: string;
      memberName: string;
    };
    toUser: {
      memberId: number;
    };
  };
  [Events.UNIT_JOIN_ACCEPTED]: {
    userId: string;
    addedMemberId: number;
    unitId: number;
    duty: LiveDuty;
  };
  [Events.UNIT_JOIN_DECLINED]: { userId: string };
};

export type EventName = (typeof Events)[keyof typeof Events];

export type EventPayload<E extends EventName> = EventsMap[E];
