import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { CharacterModule } from './character/character.module.js';
import { CitationModule } from './citation/citation.module.js';
import { VehicleModule } from './vehicle/vehicle.module.js';

@Module({
  imports: [AuthModule, CharacterModule, CitationModule, VehicleModule],
})
export class ModulesModule {}
