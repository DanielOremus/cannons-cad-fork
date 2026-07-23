// import { Injectable } from '@nestjs/common';
// import { CharacterRepository } from './character.repository';
// import { SearchCharacterDto } from './dto/search-character.dto';
// import { CharacterEntity } from './entities/character.entity';

// @Injectable()
// export class CharacterService {
//   constructor(private readonly characterRepository: CharacterRepository) {}
//   async search(dto: SearchCharacterDto): Promise<CharacterEntity | null> {
//     const character = await this.characterRepository.findByNameAndDob();
//     return character;
//   }
// }
