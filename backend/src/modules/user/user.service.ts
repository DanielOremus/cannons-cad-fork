import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';
import { PublicUserResponseDto, PrivateUserResponseDto } from '@project/shared';
import { UserEntity } from './entities/user.entity';
import { NotFoundError } from '../../shared/errors/app.error';
import { PermissionScope } from '@project/shared';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}
  async getProfile(
    id: string,
    currentUserId: string,
    scope: PermissionScope,
  ): Promise<PublicUserResponseDto | PrivateUserResponseDto> {
    if (scope === 'own' && currentUserId !== id) {
      throw new NotFoundError('User');
    }
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError('User');

    const isOwner = currentUserId === id;

    return isOwner
      ? this.userMapper.toPublicProfileDto(user)
      : this.userMapper.toPrivateProfileDto(user);
  }
  async getById(id: string): Promise<UserEntity | null> {
    return await this.userRepository.findById(id);
  }
  async getByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findByEmail(email);
  }
}
