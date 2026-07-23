import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';

@Injectable()
export abstract class UserRepository {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract create(input: CreateUserInput): Promise<UserEntity>;
  abstract update(
    id: string,
    input: UpdateUserInput,
  ): Promise<UserEntity | null>;
  abstract delete(id: string): Promise<void>;
}
