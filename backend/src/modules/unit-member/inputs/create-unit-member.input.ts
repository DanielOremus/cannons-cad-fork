import { CreateUnitMemberDto } from '@project/shared';
import { UserEntity } from '../../user/entities/user.entity.js';

export type CreateUnitMemberInput = CreateUnitMemberDto & {
  user: UserEntity['id'];
};
