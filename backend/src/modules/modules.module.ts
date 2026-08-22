import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CharacterModule } from './character/character.module';
import { CitationModule } from './citation/citation.module';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [AuthModule, CharacterModule, CitationModule, VehicleModule],
})
export class ModulesModule {}
