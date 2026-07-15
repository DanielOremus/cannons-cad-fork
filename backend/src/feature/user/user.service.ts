import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';
import { MyProfileDto } from '@project/shared';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}
  async getById(id: string): Promise<MyProfileDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userMapper.toProfileDto(user);
  }
}
