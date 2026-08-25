import { UnitOfWork } from '../../../../core/database/unit-of-work';
import { NotFoundError } from '../../../../shared/errors/app.error';
import { CharacterRepository } from '../../../character/character.repository';
import { VehicleRepository } from '../../../vehicle/vehicle.repository';
import { CitationRepository } from '../../citation.repository';
import { IssueCitationCommand } from './issue-citation.command';
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
    let character = null;
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
      ...rest,
    });
    await this.uow.saveChanges();
  }
}

//Опа хуйня парковка
//Гоп стоп по номерам випишу
//виписка штрафа: прикріпляю саме авто (прикріпляти власника?)
