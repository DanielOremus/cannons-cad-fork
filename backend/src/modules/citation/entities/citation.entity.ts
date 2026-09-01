import { p, defineEntity } from '@mikro-orm/core';
import { BaseSchema } from '../../../shared/entities/base.entity.js';
import { CharacterEntity } from '../../character/entities/character.entity.js';
import { VehicleEntity } from '../../vehicle/entities/vehicle.entity.js';
import { ChargeEntity } from './charge.entity.js';
import { CitationStatus } from '@project/shared';
import { UserEntity } from '../../user/entities/user.entity.js';

export const CitationSchema = defineEntity({
  name: 'Citation',
  extends: BaseSchema,
  properties: {
    status: p.enum(() => CitationStatus).default(CitationStatus.ACTIVE),
    charges: () => p.oneToMany(ChargeEntity).mappedBy('citation'),
    issuedCharacter: () =>
      p.manyToOne(CharacterEntity).inversedBy('citations').deleteRule('cascade'),
    issuedVehicle: () => p.manyToOne(VehicleEntity).nullable().deleteRule('set null'),
    issuedBy: () => p.manyToOne(UserEntity).nullable().deleteRule('set null'),
    issuedAt: p.datetime().onCreate(() => new Date()),
  },
});
export class CitationEntity extends CitationSchema.class {}
CitationSchema.setClass(CitationEntity);
