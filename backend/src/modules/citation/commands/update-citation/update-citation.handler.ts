import { PermissionType } from '@project/shared';
import { UnitOfWork } from '../../../../core/database/unit-of-work.js';
import { ForbiddenError, NotFoundError } from '../../../../shared/errors/app.error.js';
import { OwnershipService } from '../../../../shared/modules/ownership/ownership.service.js';
import { CitationRepository } from '../../citation.repository.js';
import { UpdateCitationCommand } from './update-citation.command.js';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateCitationCommand)
export class UpdateCitationHandler implements ICommandHandler<UpdateCitationCommand> {
  constructor(
    private readonly citationRepository: CitationRepository,
    private readonly ownershipService: OwnershipService,
    private readonly uow: UnitOfWork,
  ) {}
  async execute(command: UpdateCitationCommand): Promise<void> {
    const citation = await this.citationRepository.findById(command.id);
    if (!citation) throw new NotFoundError('Citation');

    if (command.permissionMeta.type !== PermissionType.SCOPED) throw new ForbiddenError();
    const scopes = command.permissionMeta.scopes;
    if (!scopes.includes('any')) this.ownershipService.checkCitation(citation, command.userId);

    await this.citationRepository.update(citation, command.dto);
    await this.uow.saveChanges();
  }
}
