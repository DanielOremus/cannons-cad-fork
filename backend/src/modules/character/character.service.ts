import { Injectable } from '@nestjs/common';
import { CharacterRepository } from './character.repository';
import { SearchCharacterDto } from './dto/search-character.dto';
import { CharacterEntity } from './entities/character.entity';
import { NotFoundError } from '../../shared/errors/app.error';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UserRepository } from '../user/user.repository';
import { UnitOfWork } from '../../core/database/unit-of-work';

@Injectable()
export class CharacterService {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly userRepository: UserRepository,
    private readonly uow: UnitOfWork,
  ) {}
  async search(dto: SearchCharacterDto): Promise<CharacterEntity> {
    const character = await this.characterRepository.findByNameAndDob(dto, ['user']);
    if (!character) throw new NotFoundError('Character');
    return character;
  }
  async create(userId: string, dto: CreateCharacterDto): Promise<CharacterEntity> {
    const exists = await this.userRepository.findById(userId);
    if (!exists) throw new NotFoundError('User');
    const character = await this.characterRepository.create({ user: exists.id, ...dto });
    await this.uow.saveChanges();
    return character;
  }
}
