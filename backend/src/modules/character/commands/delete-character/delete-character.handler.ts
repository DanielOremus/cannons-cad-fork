import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs';
import { DeleteCharacterCommand } from './delete-character.command.js';
import { CharacterRepository } from '../../character.repository.js';
import { ForbiddenError, NotFoundError } from '../../../../shared/errors/app.error.js';
import { UnitOfWork } from '../../../../core/database/unit-of-work.js';
import { OwnershipService } from '../../../../shared/modules/ownership/ownership.service.js';
import { PermissionType } from '@project/shared';

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

    if (command.permissionMeta.type !== PermissionType.SCOPED) throw new ForbiddenError();
    const scopes = command.permissionMeta.scopes;
    if (!scopes.includes('any')) this.ownershipService.checkCharacter(character, command.userId);

    await this.characterRepository.delete(character);
    await this.uow.saveChanges();
  }
}
