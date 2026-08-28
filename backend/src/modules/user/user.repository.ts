import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { UsersFilterDto } from './dto/get-users-filter.dto';

@Injectable()
export abstract class UserRepository {
  abstract findMany(query: UsersFilterDto): Promise<{ items: UserEntity[]; total: number }>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract create(input: CreateUserInput): Promise<UserEntity>;
  abstract update(entity: UserEntity, input: UpdateUserInput): Promise<UserEntity>;
  abstract delete(id: string): Promise<void>;
}
