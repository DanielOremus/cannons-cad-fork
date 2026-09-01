import { defineEntity, p } from '@mikro-orm/core';
import { BaseSchema } from '../../../shared/entities/base.entity.js';
import { DriverCategory } from '@project/shared';
import { CharacterEntity } from '../../character/entities/character.entity.js';

export const DriverLicenseSchema = defineEntity({
  name: 'DriverLicense',
  extends: BaseSchema,
  properties: {
    categories: p
      .enum(() => DriverCategory)
      .array()
      .default([]),
    character: () => p.oneToOne(CharacterEntity).mappedBy('driverLicense'),
  },
});

export class DriverLicenseEntity extends DriverLicenseSchema.class {}
DriverLicenseSchema.setClass(DriverLicenseEntity);
