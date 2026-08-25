import { p, defineEntity } from '@mikro-orm/core';
import { BaseSchema } from '../../../shared/entities/base.entity';
import { CharacterEntity } from '../../character/entities/character.entity';
import { VehicleEntity } from '../../vehicle/entities/vehicle.entity';
import { ChargeEntity } from './charge.entity';
import { CitationStatus } from '@project/shared';

export const CitationSchema = defineEntity({
  name: 'Citation',
  extends: BaseSchema,
  properties: {
    status: p.enum(() => CitationStatus).default(CitationStatus.ACTIVE),
    charges: () => p.oneToMany(ChargeEntity).mappedBy('citation'),
    issuedCharacter: () =>
      p.manyToOne(CharacterEntity).inversedBy('citations').deleteRule('cascade'),
    issuedVehicle: () => p.manyToOne(VehicleEntity).nullable().deleteRule('set null'),
    issuedAt: p.datetime().onCreate(() => new Date()),
  },
});
export class CitationEntity extends CitationSchema.class {}
CitationSchema.setClass(CitationEntity);
