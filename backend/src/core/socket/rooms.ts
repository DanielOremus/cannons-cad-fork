import { LiveDuty } from '@project/shared';

export const Rooms = {
  unit: (id: number) => `unit:${id}`,
  unitMember: (id: number) => `unit-member:${id}`,
  lobby: (duty: LiveDuty) => `lobby:${duty}`,
  dispatch: `dispatch`,
} as const;
