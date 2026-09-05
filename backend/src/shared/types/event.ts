import { UnitStatus } from '@project/shared';

export const Events = {
  UNIT_STATUS_UPDATED: 'unit.status.updated',
  UNIT_UPDATED: 'unit.updated',
  INCIDENT_UPDATED: 'incident.updated',
} as const;

export type EventName = (typeof Events)[keyof typeof Events];

type EventsMap = {
  [Events.UNIT_STATUS_UPDATED]: { status: UnitStatus; id: number };
  [Events.UNIT_UPDATED]: { id: number };
  [Events.INCIDENT_UPDATED]: { id: number };
};

export type EventPayload<E extends EventName> = EventsMap[E];

// type EventPayloads = {
//   unit: {
//     'status.updated': ;
//     update: {  };
//   };
//   incident: {
//     updated: { id: number };
//   };
// };

// export type EventResource = keyof EventPayloads;

// type EventsUnion = {
//   [Resource in EventResource & string]: {
//     [Event in keyof EventPayloads[Resource] & string]: {
//       event: `${Resource}.${Event}`;
//       payload: EventPayloads[Resource][Event];
//     };
//   }[keyof EventPayloads[Resource] & string];
// }[EventResource & string];

// export type EventsMap = {
//   [E in EventsUnion as E['event']]: E['payload'];
// };

// export type EventName = keyof EventsMap;
