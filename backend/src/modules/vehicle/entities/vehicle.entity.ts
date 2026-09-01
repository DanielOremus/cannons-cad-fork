import { defineEntity, p } from '@mikro-orm/core';
import { BaseSchema } from '../../../shared/entities/base.entity.js';
import { VehicleFlag, VehicleType } from '@project/shared';
import { CharacterEntity } from '../../character/entities/character.entity.js';

export const VehicleSchema = defineEntity({
  name: 'Vehicle',
  extends: BaseSchema,
  properties: {
    type: p.enum(() => VehicleType),
    licensePlate: p.string().unique(),
    make: p.string(),
    model: p.string(),
    year: p.decimal().precision(4).scale(0),
    color: p.string().nullable(),
    flags: p
      .enum(() => VehicleFlag)
      .array()
      .default([]),
    owner: () => p.manyToOne(CharacterEntity).inversedBy('vehicles').deleteRule('cascade'),
  },
});

export class VehicleEntity extends VehicleSchema.class {}
VehicleSchema.setClass(VehicleEntity);
