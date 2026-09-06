import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCharacterQuery } from './get-character.query.js';
import { CharacterRepository } from '../../character.repository.js';
import { NotFoundError } from '../../../../shared/errors/app.error.js';
import { CharacterMapper } from '../../character.mapper.js';
import { OwnershipService } from '../../../../shared/modules/ownership/ownership.service.js';
import { getScopesOrThrow } from '../../../../shared/utils/permission.helpers.js';

@QueryHandler(GetCharacterQuery)
export class GetCharacterHandler implements IQueryHandler<GetCharacterQuery> {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly characterMapper: CharacterMapper,
    private readonly ownershipService: OwnershipService,
  ) {}
  async execute(query: GetCharacterQuery) {
    const character = await this.characterRepository.findById(query.characterId, ['driverLicense']);
    if (!character) throw new NotFoundError('Character');

    const scopes = getScopesOrThrow(query.permissionMeta);
    if (!scopes.includes('any')) this.ownershipService.checkCharacter(character, query.userId);

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
