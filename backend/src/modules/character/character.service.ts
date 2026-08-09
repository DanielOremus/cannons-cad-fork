import { Injectable } from '@nestjs/common';
import { CharacterRepository } from './character.repository';
import { SearchCharacterDto } from './dto/search-character.dto';
import { CharacterEntity } from './entities/character.entity';
import { NotFoundError } from '../../shared/errors/app.error';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UserRepository } from '../user/user.repository';
import { UnitOfWork } from '../../core/database/unit-of-work';
import { CharacterDto, PaginationDto } from '@project/shared';
import { CitationRepository } from '../citation/citation.repository';
import { VehicleRepository } from '../vehicle/vehicle.repository';

@Injectable()
export class CharacterService {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly userRepository: UserRepository,
    private readonly citationRepository: CitationRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly uow: UnitOfWork,
  ) {}
  async search(dto: SearchCharacterDto) {
    const character = await this.characterRepository.findByNameAndDob(dto, ['user']);
    if (!character) throw new NotFoundError('Character');
    const [vehicles, citations] = await Promise.all([
      this.vehicleRepository.countByCharacter(character.id),
      this.citationRepository.countByCharacter(character.id),
    ]);
    return { character, counts: { vehicles, citations } };
  }
  async getById(characterId: number) {
    const character = await this.characterRepository.findById(characterId, ['driverLicense']);
    if (!character) throw new NotFoundError('Character');
    const [vehicles, citations] = await Promise.all([
      this.vehicleRepository.countByCharacter(character.id),
      this.citationRepository.countByCharacter(character.id),
    ]);
    // const citations = await this.citationRepository.findByCharacter(
    //   character.id,
    //   pagination.citations,
    // );
    // const vehicles = await this.citationRepository.findByCharacter(
    //   character.id,
    //   pagination.vehicles,
    // );
    return { character, counts: { vehicles, citations } };
  }
  async create(userId: string, dto: CreateCharacterDto): Promise<CharacterEntity> {
    const exists = await this.userRepository.findById(userId);
    if (!exists) throw new NotFoundError('User');
    const character = await this.characterRepository.create({ user: exists.id, ...dto });
    await this.uow.saveChanges();
    return character;
  }
}
