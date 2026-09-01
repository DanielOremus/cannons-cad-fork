import { NotFoundError } from '../../../../shared/errors/app.error.js';
import { CharacterMapper } from '../../character.mapper.js';
import { CharacterRepository } from '../../character.repository.js';
import { SearchCharacterQuery } from './search-character.query.js';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(SearchCharacterQuery)
export class SearchCharacterHandler implements IQueryHandler<SearchCharacterQuery> {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly characterMapper: CharacterMapper,
  ) {}
  async execute(query: SearchCharacterQuery) {
    const character = await this.characterRepository.findByNameAndDob(query.dto, ['user']);
    if (!character) throw new NotFoundError('Character');

    const [vehiclesCount, citationsCount] = await Promise.all([
      this.characterRepository.countVehicles(character),
      this.characterRepository.countCitations(character),
    ]);
    return this.characterMapper.toSearchResponseDto(character, {
      vehicles: vehiclesCount,
      citations: citationsCount,
    });
  }
}
