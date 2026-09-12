import { defineEntity, EventArgs, p } from '@mikro-orm/core';
import { BaseSchema } from '../../../shared/entities/base.entity.js';
import { UserEntity } from '../../user/entities/user.entity.js';
import { UnitEntity } from '../../unit/entities/unit.entity.js';

export const UnitMemberSchema = defineEntity({
  name: 'UnitMember',
  extends: BaseSchema,
  properties: {
    name: p.string(),
    rank: p.string(),
    user: () => p.oneToOne(UserEntity).inversedBy('id').deleteRule('cascade'),
    unit: () => p.manyToOne(UnitEntity).inversedBy('id').nullable().deleteRule('set null'),
    lastJoinAt: p.datetime().nullable(),
  },
});

export class UnitMemberEntity extends UnitMemberSchema.class {}
UnitMemberSchema.setClass(UnitMemberEntity);
