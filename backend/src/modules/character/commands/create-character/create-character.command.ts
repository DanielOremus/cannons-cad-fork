import { Command } from '@nestjs/cqrs';
import { CreateCharacterDto, CreateCharacterResponseDto } from '../../dto/create-character.dto.js';

export class CreateCharacterCommand extends Command<CreateCharacterResponseDto> {
  constructor(
    readonly dto: CreateCharacterDto,
    readonly userId: string,
  ) {
    super();
  }
}
