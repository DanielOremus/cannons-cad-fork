import { GetUserQuery } from './get-user.query.js';
import { QueryHandler } from '@nestjs/cqrs';
import { IQueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../user.repository.js';
import { UserMapper } from '../../user.mapper.js';
import { NotFoundError } from '../../../../shared/errors/app.error.js';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}
  async execute(query: GetUserQuery) {
    const { userId, permissionScope } = query;
    if (permissionScope !== 'any') {
      throw new NotFoundError('User');
    }
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('User');

    return this.userMapper.toReadDto(user);
  }
}
