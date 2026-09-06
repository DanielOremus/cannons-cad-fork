import { UnitOfWork } from '../../../../core/database/unit-of-work.js';
import { NotFoundError } from '../../../../shared/errors/app.error.js';
import { OwnershipService } from '../../../../shared/modules/ownership/ownership.service.js';
import { CitationRepository } from '../../citation.repository.js';
import { DeleteCitationCommand } from './delete-citation.command.js';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { getScopesOrThrow } from '../../../../shared/utils/permission.helpers.js';

@CommandHandler(DeleteCitationCommand)
export class DeleteCitationHandler implements ICommandHandler<DeleteCitationCommand> {
  constructor(
    private readonly citationRepository: CitationRepository,
    private readonly ownershipService: OwnershipService,
    private readonly uow: UnitOfWork,
  ) {}
  async execute(command: DeleteCitationCommand): Promise<void> {
    const citation = await this.citationRepository.findById(command.id);
    if (!citation) throw new NotFoundError('Citation');

    const scopes = getScopesOrThrow(command.permissionMeta);
    if (!scopes.includes('any')) this.ownershipService.checkCitation(citation, command.userId);

    await this.citationRepository.delete(citation);
    await this.uow.saveChanges();
  }
}
