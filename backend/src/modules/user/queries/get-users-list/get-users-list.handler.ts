import { GetUsersListQuery } from './get-users-list.query.js';
import { QueryHandler } from '@nestjs/cqrs';
import { IQueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../user.repository.js';
import { UserMapper } from '../../user.mapper.js';
import { ForbiddenError } from '../../../../shared/errors/app.error.js';
import { PermissionType } from '@project/shared';

@QueryHandler(GetUsersListQuery)
export class GetUsersListHandler implements IQueryHandler<GetUsersListQuery> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}
  async execute(query: GetUsersListQuery) {
    if (query.permissionMeta.type !== PermissionType.SCOPED) throw new ForbiddenError();
    const scopes = query.permissionMeta.scopes;
    if (!scopes.includes('any')) throw new ForbiddenError();

    const { items, total } = await this.userRepository.findMany(query.queryParams);

    return {
      items: this.userMapper.toListDto(items),
      total,
      page: query.queryParams.page,
      limit: query.queryParams.limit,
    };
  }
}
