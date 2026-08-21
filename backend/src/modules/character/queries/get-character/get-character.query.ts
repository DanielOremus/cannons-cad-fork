import { Query } from '@nestjs/cqrs';
import { CharacterDto } from '../../dto/get-character.dto';

export class GetCharacterQuery extends Query<CharacterDto> {
  constructor(readonly characterId: number) {
    super();
  }
}
