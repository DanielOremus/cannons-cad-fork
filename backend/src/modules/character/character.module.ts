import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CharacterEntity } from './entities/character.entity';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { CharacterRepository } from './character.repository';
import { OrmCharacterRepository } from './infrastructure/orm.character.repository';
import { CharacterMapper } from './character.mapper';
import { UserModule } from '../user/user.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { CitationModule } from '../citation/citation.module';
import { DriverLicenseModule } from '../driver-license/driver-license.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([CharacterEntity]),
    UserModule,
    VehicleModule,
    CitationModule,
    DriverLicenseModule,
  ],
  controllers: [CharacterController],
  providers: [
    CharacterService,
    {
      provide: CharacterRepository,
      useClass: OrmCharacterRepository,
    },
    CharacterMapper,
  ],
})
export class CharacterModule {}
