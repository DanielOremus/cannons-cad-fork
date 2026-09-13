import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { CharacterModule } from './character/character.module.js';
import { CitationModule } from './citation/citation.module.js';
import { VehicleModule } from './vehicle/vehicle.module.js';
import { UnitJoinRequestModule } from './unit-join-request/unit-join-request.module.js';

@Module({
  imports: [AuthModule, CharacterModule, CitationModule, VehicleModule, UnitJoinRequestModule],
})
export class ModulesModule {}
