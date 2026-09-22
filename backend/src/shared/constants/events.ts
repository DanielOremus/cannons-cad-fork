import { LiveDuty } from '@project/shared';
import { UnitDto } from '../../modules/unit/dto/get-unit.dto.js';
import { UnitMemberDto } from '../../modules/unit-member/dto/get-unit-member.dto.js';
import { UpdateUnitResponseDto } from '../../modules/unit/dto/update-unit.dto.js';

export const Events = {
  USER_ROLES_CHANGED: 'user.roles.changed',
  USER_STATUS_CHANGED: 'user.status.changed',

  UNIT_UPDATED: 'unit.updated',
  INCIDENT_UPDATED: 'incident.updated',
  UNIT_MEMBER_LEFT: 'unit-member.left',
  UNIT_MEMBER_JOINED: 'unit-member.joined',
  UNIT_CREATED: 'unit.created',
  UNIT_JOIN_SENT: 'unit.join.sent',
  UNIT_JOIN_ACCEPTED: 'unit.join.accepted',
  UNIT_JOIN_DECLINED: 'unit.join.declined',
  UNIT_DELETED: 'unit.deleted',
} as const;

type EventsMap = {
  //users
  [Events.USER_ROLES_CHANGED]: { userId: string };
  [Events.USER_STATUS_CHANGED]: { userId: string };
  //units
  [Events.UNIT_UPDATED]: UpdateUnitResponseDto;
  [Events.INCIDENT_UPDATED]: { id: number };
  [Events.UNIT_MEMBER_LEFT]: { unitId: number; memberId: number; userId: string };
  [Events.UNIT_MEMBER_JOINED]: {
    userId: string;
    member: UnitMemberDto;
    unitId: number;
    duty: LiveDuty;
  };
  [Events.UNIT_CREATED]: { unit: UnitDto };
  [Events.UNIT_DELETED]: { id: number; duty: LiveDuty };
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
    duty: LiveDuty;
  };
  [Events.UNIT_JOIN_DECLINED]: { userId: string };
};

export type EventName = (typeof Events)[keyof typeof Events];

export type EventPayload<E extends EventName> = EventsMap[E];
