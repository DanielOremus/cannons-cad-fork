import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CharacterEntity } from './entities/character.entity';
import { CharacterController } from './character.controller';
import { CharacterRepository } from './character.repository';
import { OrmCharacterRepository } from './infrastructure/orm.character.repository';
import { CharacterMapper } from './character.mapper';
import { UserModule } from '../user/user.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { CitationModule } from '../citation/citation.module';
import { DriverLicenseModule } from '../driver-license/driver-license.module';
import { GetCharacterHandler } from './queries/get-character/get-character.handler';
import { SearchCharacterHandler } from './queries/search-character/search-character.handler';
import { CreateCharacterHandler } from './commands/create-character/create-character.handler';

const queryHandlers = [GetCharacterHandler, SearchCharacterHandler];
const commandHandlers = [CreateCharacterHandler];

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
    ...queryHandlers,
    ...commandHandlers,
    {
      provide: CharacterRepository,
      useClass: OrmCharacterRepository,
    },
    CharacterMapper,
  ],
})
export class CharacterModule {}
