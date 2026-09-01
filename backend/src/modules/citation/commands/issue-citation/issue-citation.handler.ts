import { UnitOfWork } from '../../../../core/database/unit-of-work.js';
import { NotFoundError } from '../../../../shared/errors/app.error.js';
import { CharacterRepository } from '../../../character/character.repository.js';
import { VehicleRepository } from '../../../vehicle/vehicle.repository.js';
import { CitationRepository } from '../../citation.repository.js';
import { IssueCitationCommand } from './issue-citation.command.js';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(IssueCitationCommand)
export class IssueCitationHandler implements ICommandHandler<IssueCitationCommand> {
  constructor(
    private readonly citationRepository: CitationRepository,
    private readonly characterRepository: CharacterRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly uow: UnitOfWork,
  ) {}
  async execute(command: IssueCitationCommand): Promise<void> {
    let character;
    let vehicle = null;
    if (command.dto.issuedVehicleId) {
      vehicle = await this.vehicleRepository.findById(command.dto.issuedVehicleId, ['owner']);
      if (!vehicle) throw new NotFoundError('Vehicle');
      character = vehicle.owner;
    } else {
      character = await this.characterRepository.findById(command.dto.issuedCharacterId);
      if (!character) throw new NotFoundError('Character');
    }

    const { issuedCharacterId, issuedVehicleId, ...rest } = command.dto;
    await this.citationRepository.issue({
      issuedCharacter: character,
      issuedVehicle: vehicle,
      issuedBy: command.userId,
      ...rest,
    });
    await this.uow.saveChanges();
  }
}
