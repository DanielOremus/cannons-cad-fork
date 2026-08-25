import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCharacterQuery } from './get-character.query';
import { CharacterRepository } from '../../character.repository';
import { NotFoundError } from '../../../../shared/errors/app.error';
import { CharacterMapper } from '../../character.mapper';

@QueryHandler(GetCharacterQuery)
export class GetCharacterHandler implements IQueryHandler<GetCharacterQuery> {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly characterMapper: CharacterMapper,
  ) {}
  async execute(query: GetCharacterQuery) {
    const character = await this.characterRepository.findById(query.characterId, ['driverLicense']);
    if (!character) throw new NotFoundError('Character');

    const [vehiclesCount, citationsCount] = await Promise.all([
      this.characterRepository.countVehicles(character),
      this.characterRepository.countCitations(character),
    ]);

    return this.characterMapper.toReadDto(character, {
      vehicles: vehiclesCount,
      citations: citationsCount,
    });
  }
}
