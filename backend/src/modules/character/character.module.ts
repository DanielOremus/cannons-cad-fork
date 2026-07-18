import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { CharacterRepository } from './character.repository';
import { CharacterMapper } from './character.mapper';

@Module({
  controllers: [CharacterController],
  providers: [CharacterService, CharacterRepository, CharacterMapper],
})
export class CharacterModule {}
