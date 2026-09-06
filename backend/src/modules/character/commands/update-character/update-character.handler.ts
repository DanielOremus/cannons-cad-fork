import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateCharacterCommand } from './update-character.command.js';
import { CharacterRepository } from '../../character.repository.js';
import { NotFoundError } from '../../../../shared/errors/app.error.js';
import { UnitOfWork } from '../../../../core/database/unit-of-work.js';
import { OwnershipService } from '../../../../shared/modules/ownership/ownership.service.js';
import { getScopesOrThrow } from '../../../../shared/utils/permission.helpers.js';

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

    const scopes = getScopesOrThrow(command.permissionMeta);
    if (!scopes.includes('any')) this.ownershipService.checkCharacter(character, command.userId);

    await this.characterRepository.update(character, command.dto);
    await this.uow.saveChanges();
  }
}
