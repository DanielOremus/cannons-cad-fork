import { CreateCharacterDto } from '../dto/create-character.dto.js';
import { UserEntity } from '../../user/entities/user.entity.js';

export type CreateCharacterInput = CreateCharacterDto & {
  user: UserEntity['id'];
};
