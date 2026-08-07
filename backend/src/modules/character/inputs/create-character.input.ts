import { CreateCharacterDto } from '../dto/create-character.dto';
import { UserEntity } from '../../user/entities/user.entity';

export type CreateCharacterInput = CreateCharacterDto & {
  user: UserEntity['id'];
};
