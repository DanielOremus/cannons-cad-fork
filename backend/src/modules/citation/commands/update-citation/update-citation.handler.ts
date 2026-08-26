import { UnitOfWork } from '../../../../core/database/unit-of-work';
import { NotFoundError } from '../../../../shared/errors/app.error';
import { OwnershipService } from '../../../../shared/modules/ownership/ownership.service';
import { CitationRepository } from '../../citation.repository';
import { UpdateCitationCommand } from './update-citation.command';
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

    this.ownershipService.checkCitation(citation, command.userId, command.scope);

    await this.citationRepository.update(citation, command.dto);
    await this.uow.saveChanges();
  }
}
