import { NotFoundError } from '../../../../shared/errors/app.error';
import { CitationRepository } from '../../../citation/citation.repository';
import { VehicleRepository } from '../../../vehicle/vehicle.repository';
import { CharacterMapper } from '../../character.mapper';
import { CharacterRepository } from '../../character.repository';
import { SearchCharacterQuery } from './search-character.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(SearchCharacterQuery)
export class SearchCharacterHandler implements IQueryHandler<SearchCharacterQuery> {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly citationRepository: CitationRepository,
    private readonly characterMapper: CharacterMapper,
  ) {}
  async execute(query: SearchCharacterQuery) {
    const character = await this.characterRepository.findByNameAndDob(query.dto);
    if (!character) throw new NotFoundError('Character');

    const [vehiclesCount, citationsCount] = await Promise.all([
      this.vehicleRepository.countByCharacter(character.id),
      this.citationRepository.countByCharacter(character.id),
    ]);
    return this.characterMapper.toSearchResponseDto(character, {
      vehicles: vehiclesCount,
      citations: citationsCount,
    });
  }
}
