import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetCharactersListQuery } from './get-characters-list.query.js';
import { PaginatedList } from '@project/shared';
import { CharacterListItemDto } from '../../dto/get-character.dto.js';
import { CharacterRepository } from '../../character.repository.js';
import { getScopesOrThrow } from '../../../../shared/utils/permission.helpers.js';
import { UserRepository } from '../../../user/user.repository.js';
import { NotFoundError } from '../../../../shared/errors/app.error.js';
import { CharacterMapper } from '../../character.mapper.js';
import { OwnershipService } from '../../../../shared/modules/ownership/ownership.service.js';

@QueryHandler(GetCharactersListQuery)
export class GetCharactersListHandler implements IQueryHandler<GetCharactersListQuery> {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly userRepository: UserRepository,
    private readonly characterMapper: CharacterMapper,
    private readonly ownershipService: OwnershipService,
  ) {}
  async execute(query: GetCharactersListQuery): Promise<PaginatedList<CharacterListItemDto>> {
    const { targetUserId, permissionMeta, currentUserId, pagination } = query;
    const scopes = getScopesOrThrow(permissionMeta);

    if (!scopes.includes('any')) {
      this.ownershipService.checkProfile(targetUserId, currentUserId);
      const { total, items } = await this.characterRepository.findManyByUserId(
        currentUserId,
        pagination,
      );
      return {
        total,
        limit: pagination.limit,
        page: pagination.page,
        items: this.characterMapper.toListDto(items),
      };
    }

    const user = await this.userRepository.findById(targetUserId);
    if (!user) throw new NotFoundError('User');

    const { total, items } = await this.characterRepository.findManyByUserId(
      targetUserId,
      pagination,
    );
    return {
      total,
      limit: pagination.limit,
      page: pagination.page,
      items: this.characterMapper.toListDto(items),
    };
  }
}
