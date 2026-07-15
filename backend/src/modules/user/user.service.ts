import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';
import {
  UserOwnProfileDto,
  RegisterUserDto,
  UserPublicProfileDto,
} from '@project/shared';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}
  async getById(id: string): Promise<UserPublicProfileDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      //TODO: add abstraction for exceptions
      throw new NotFoundException('User not found');
    }
    return this.userMapper.toPublicProfileDto(user);
  }
  async getByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findByEmail(email);
  }
  async create(dto: RegisterUserDto): Promise<UserOwnProfileDto> {
    const exists = await this.userRepository.findByEmail(dto.email);
    if (exists)
      throw new ConflictException('User with this email already exists');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const input = this.userMapper.toCreateInput(dto, passwordHash);
    const user = await this.userRepository.create(input);
    return this.userMapper.toOwnProfileDto(user);
  }
}
