import { QueryHandler } from '@nestjs/cqrs';
import { IQueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../user.repository.js';
import { UserMapper } from '../../user.mapper.js';
import { NotFoundError } from '../../../../shared/errors/app.error.js';
import { GetOwnProfileQuery } from './get-own-profile.query.js';

@QueryHandler(GetOwnProfileQuery)
export class GetOwnProfileHandler implements IQueryHandler<GetOwnProfileQuery> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}
  async execute(query: GetOwnProfileQuery) {
    const user = await this.userRepository.findById(query.userId);
    if (!user) throw new NotFoundError('User');

    return this.userMapper.toProfileDto(user);
  }
}
