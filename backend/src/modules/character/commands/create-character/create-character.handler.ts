import { UnitOfWork } from '../../../../core/database/unit-of-work.js';
import { NotFoundError } from '../../../../shared/errors/app.error.js';
import { UserRepository } from '../../../user/user.repository.js';
import { CharacterMapper } from '../../character.mapper.js';
import { CharacterRepository } from '../../character.repository.js';
import { CreateCharacterCommand } from './create-character.command.js';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateCharacterCommand)
export class CreateCharacterHandler implements ICommandHandler<CreateCharacterCommand> {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly userRepository: UserRepository,
    private readonly uow: UnitOfWork,
    private readonly characterMapper: CharacterMapper,
  ) {}
  async execute(command: CreateCharacterCommand) {
    const exists = await this.userRepository.findById(command.userId);
    if (!exists) throw new NotFoundError('User');
    const character = await this.characterRepository.create({ user: exists.id, ...command.dto });
    await this.uow.saveChanges();
    return this.characterMapper.toCreateResponseDto(character);
  }
}
