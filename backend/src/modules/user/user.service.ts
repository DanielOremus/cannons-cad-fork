import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';
import {
  PublicUserResponseDto,
  PrivateUserResponseDto,
} from './dto/user-response.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import {
  AlreadyExistsError,
  NotFoundError,
} from '../../shared/errors/app.error';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}
  async getProfile(
    id: string,
    profile: 'public' | 'private' = 'public',
  ): Promise<PublicUserResponseDto | PrivateUserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError('User');
    let toReturn;
    if (profile !== 'private')
      toReturn = this.userMapper.toPublicProfileDto(user);
    else toReturn = this.userMapper.toPrivateProfileDto(user);
    return toReturn;
  }
  async getById(id: string): Promise<UserEntity | null> {
    return await this.userRepository.findById(id);
  }
  async getByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findByEmail(email);
  }
  async create(dto: RegisterUserDto): Promise<UserEntity> {
    const exists = await this.userRepository.findByEmail(dto.email);
    if (exists)
      throw new AlreadyExistsError('User with this email already exists');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const input = this.userMapper.toCreateInput({ ...dto, passwordHash });
    return await this.userRepository.create(input);
  }
}
