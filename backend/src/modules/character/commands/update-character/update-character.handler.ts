import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateCharacterCommand } from './update-character.command';
import { CharacterRepository } from '../../character.repository';
import { NotFoundError } from '../../../../shared/errors/app.error';
import { UnitOfWork } from '../../../../core/database/unit-of-work';
import { OwnershipService } from '../../../../shared/modules/ownership/ownership.service';

@CommandHandler(UpdateCharacterCommand)
export class UpdateCharacterHandler implements ICommandHandler<UpdateCharacterCommand> {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly ownershipService: OwnershipService,
    private readonly uow: UnitOfWork,
  ) {}
  async execute(command: UpdateCharacterCommand) {
    const character = await this.characterRepository.findById(command.characterId);
    if (!character) throw new NotFoundError('Character');
    this.ownershipService.checkCharacter(character, command.userId, command.scope);

    await this.characterRepository.update(character, command.dto);
    await this.uow.saveChanges();
  }
}
