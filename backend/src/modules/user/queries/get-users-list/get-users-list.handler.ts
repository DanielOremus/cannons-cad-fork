import { GetUsersListQuery } from './get-users-list.query.js';
import { QueryHandler } from '@nestjs/cqrs';
import { IQueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../user.repository.js';
import { UserMapper } from '../../user.mapper.js';
import { ForbiddenError } from '../../../../shared/errors/app.error.js';

@QueryHandler(GetUsersListQuery)
export class GetUsersListHandler implements IQueryHandler<GetUsersListQuery> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}
  async execute(query: GetUsersListQuery) {
    if (query.scope !== 'any') throw new ForbiddenError('User');

    const { items, total } = await this.userRepository.findMany(query.queryParams);

    return {
      items: this.userMapper.toListDto(items),
      total,
      page: query.queryParams.page,
      limit: query.queryParams.limit,
    };
  }
}
