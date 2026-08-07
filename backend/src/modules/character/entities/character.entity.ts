import { BaseSchema } from '../../../shared/entities/base.entity';
import { defineEntity, Opt, p } from '@mikro-orm/core';
import { CharacterFlag, CharacterGender } from '@project/shared';
import { UserEntity } from '../../user/entities/user.entity';
import { DriverLicenseEntity } from '../../driver-license/entities/driver-license.entity';
import { VehicleEntity } from '../../vehicle/entities/vehicle.entity';
import { CitationEntity } from '../../citation/entities/citation.entity';

export const CharacterSchema = defineEntity({
  name: 'Character',
  extends: BaseSchema,
  properties: {
    firstName: p.string(),
    lastName: p.string(),
    dob: p.date(),
    age: p.type('method').persist(false).getter(),
    gender: p.enum(() => CharacterGender),
    phoneNumber: p.string().nullable(),
    address: p.string().nullable(),
    hasGunPermit: p.boolean().default(false),
    flags: p
      .enum(() => CharacterFlag)
      .array()
      .default([]),
    user: () => p.manyToOne(UserEntity).inversedBy('characters').deleteRule('cascade'),
    driverLicense: () =>
      p.oneToOne(DriverLicenseEntity).inversedBy('character').nullable().deleteRule('set null'),
    vehicles: () => p.oneToMany(VehicleEntity).mappedBy('owner'),
    citations: () => p.oneToMany(CitationEntity).mappedBy('issuedCharacter'),
  },
});

export class CharacterEntity extends CharacterSchema.class {
  get age(): Opt<number> {
    const now = new Date();
    const dob = new Date(this.dob);

    const bYear = dob.getUTCFullYear();
    const bMonth = dob.getUTCMonth();
    const bDay = dob.getUTCDay();

    const nYear = now.getUTCFullYear();
    const nMonth = now.getUTCMonth();
    const nDay = now.getUTCDay();

    let age = nYear - bYear;

    const hadBirthday = bMonth > nMonth || (bMonth === nMonth && bDay >= nDay);
    if (!hadBirthday) {
      age--;
    }

    return age;
  }
}
CharacterSchema.setClass(CharacterEntity);
