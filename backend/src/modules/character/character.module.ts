import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CharacterEntity } from './entities/character.entity';
// import { CharacterService } from './character.service';
// import { CharacterController } from './character.controller';
// import { CharacterRepository } from './character.repository';
// import { CharacterMapper } from './character.mapper';

@Module({
  imports: [MikroOrmModule.forFeature([CharacterEntity])],
  // controllers: [CharacterController],
  // providers: [CharacterService, CharacterRepository, CharacterMapper],
})
export class CharacterModule {}
