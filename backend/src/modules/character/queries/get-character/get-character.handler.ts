import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCharacterQuery } from './get-character.query';
import { CharacterRepository } from '../../character.repository';
import { VehicleRepository } from '../../../vehicle/vehicle.repository';
import { CitationRepository } from '../../../citation/citation.repository';
import { NotFoundError } from '../../../../shared/errors/app.error';
import { CharacterMapper } from '../../character.mapper';

@QueryHandler(GetCharacterQuery)
export class GetCharacterHandler implements IQueryHandler<GetCharacterQuery> {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly citationRepository: CitationRepository,
    private readonly characterMapper: CharacterMapper,
  ) {}
  async execute(query: GetCharacterQuery) {
    const character = await this.characterRepository.findById(query.characterId, ['driverLicense']);
    if (!character) throw new NotFoundError('Character');

    const [vehiclesCount, citationsCount] = await Promise.all([
      this.vehicleRepository.countByCharacter(character.id),
      this.citationRepository.countByCharacter(character.id),
    ]);

    return this.characterMapper.toReadDto(character, {
      vehicles: vehiclesCount,
      citations: citationsCount,
    });
  }
}
