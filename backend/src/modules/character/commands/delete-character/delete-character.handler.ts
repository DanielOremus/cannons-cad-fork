import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs';
import { DeleteCharacterCommand } from './delete-character.command';
import { CharacterRepository } from '../../character.repository';
import { NotFoundError } from '../../../../shared/errors/app.error';
import { UnitOfWork } from '../../../../core/database/unit-of-work';
import { OwnershipService } from '../../../../shared/modules/ownership/ownership.service';

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
