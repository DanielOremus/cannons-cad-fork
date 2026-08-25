// export const CitationSchema = defineEntity({
//   name: 'Citation',
//   extends: BaseSchema,
//   properties: {
//     charges: () => p.oneToMany(ChargeEntity).mappedBy('citation'),
//     issuedVehicle: () => p.manyToOne(VehicleEntity).nullable().deleteRule('set null').owner(),
//     issuedCharacter: () =>
//       p.manyToOne(CharacterEntity).inversedBy('citations').deleteRule('cascade').owner(),
//     issuedAt: p.datetime().onCreate(() => new Date()),
//   },
// });

// export const ChargeSchema = defineEntity({
//   name: 'ChargeEntity',
//   extends: BaseSchema,
//   properties: {
//     amount: p.integer(),
//     reason: p.string(),
//     jailTime: p.string().nullable(),
//     count: p.integer().default(1),
//     citation: () => p.manyToOne(CitationEntity).deleteRule('cascade'),
//   },
// });

import { z } from 'zod/v4';
import { idValidator } from './common.schema.js';

const chargeValidator = z.object({
  amount: z.int().positive(),
  reason: z.string().trim().nonempty(),
  jailTime: z.string().trim().nullish(),
  count: z.int().positive().default(1),
});

export const createCitationSchema = z.object({
  charges: z.array(chargeValidator).nonempty(),
  issuedCharacterId: idValidator,
  issuedVehicleId: z.nullish(idValidator),
});
