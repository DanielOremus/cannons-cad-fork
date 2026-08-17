import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs';
import { DeleteCharacterCommand } from './delete-character.command';
import { CharacterRepository } from '../../character.repository';
import { NotFoundError } from '../../../../shared/errors/app.error';
import { UnitOfWork } from '../../../../core/database/unit-of-work';

@CommandHandler(DeleteCharacterCommand)
export class DeleteCharacterHandler implements ICommandHandler<DeleteCharacterCommand> {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly uow: UnitOfWork,
  ) {}
  async execute(command: DeleteCharacterCommand) {
    const character = await this.characterRepository.findById(command.characterId);
    if (!character) throw new NotFoundError('Character');
    if (command.scope === 'own') {
      if (character.user.id !== command.userId) throw new NotFoundError('Character');
    }
    await this.characterRepository.delete(character);
    await this.uow.saveChanges();
  }
}
