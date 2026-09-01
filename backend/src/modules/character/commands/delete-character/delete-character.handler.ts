import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs';
import { DeleteCharacterCommand } from './delete-character.command.js';
import { CharacterRepository } from '../../character.repository.js';
import { NotFoundError } from '../../../../shared/errors/app.error.js';
import { UnitOfWork } from '../../../../core/database/unit-of-work.js';
import { OwnershipService } from '../../../../shared/modules/ownership/ownership.service.js';

@CommandHandler(DeleteCharacterCommand)
export class DeleteCharacterHandler implements ICommandHandler<DeleteCharacterCommand> {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly ownershipService: OwnershipService,
    private readonly uow: UnitOfWork,
  ) {}
  async execute(command: DeleteCharacterCommand) {
    const character = await this.characterRepository.findById(command.characterId);
    if (!character) throw new NotFoundError('Character');
    this.ownershipService.checkCharacter(character, command.userId, command.scope);
    await this.characterRepository.delete(character);
    await this.uow.saveChanges();
  }
}
