import { UnitOfWork } from '../../../../core/database/unit-of-work';
import { NotFoundError } from '../../../../shared/errors/app.error';
import { OwnershipService } from '../../../../shared/modules/ownership/ownership.service';
import { CitationRepository } from '../../citation.repository';
import { DeleteCitationCommand } from './delete-citation.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

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

    this.ownershipService.checkCitation(citation, command.userId, command.scope);

    await this.citationRepository.delete(citation);
    await this.uow.saveChanges();
  }
}
