import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CharacterEntity } from './entities/character.entity.js';
import { CharacterController } from './character.controller.js';
import { CharacterRepository } from './character.repository.js';
import { OrmCharacterRepository } from './infrastructure/orm.character.repository.js';
import { CharacterMapper } from './character.mapper.js';
import { UserModule } from '../user/user.module.js';
import { DriverLicenseModule } from '../driver-license/driver-license.module.js';
import { GetCharacterHandler } from './queries/get-character/get-character.handler.js';
import { SearchCharacterHandler } from './queries/search-character/search-character.handler.js';
import { CreateCharacterHandler } from './commands/create-character/create-character.handler.js';
import { UpdateCharacterHandler } from './commands/update-character/update-character.handler.js';
import { DeleteCharacterHandler } from './commands/delete-character/delete-character.handler.js';
import { OwnershipModule } from '../../shared/modules/ownership/ownership.module.js';

const queryHandlers = [GetCharacterHandler, SearchCharacterHandler];
const commandHandlers = [CreateCharacterHandler, UpdateCharacterHandler, DeleteCharacterHandler];

@Module({
  imports: [
    MikroOrmModule.forFeature([CharacterEntity]),
    UserModule,
    DriverLicenseModule,
    OwnershipModule,
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
  exports: [CharacterRepository],
})
export class CharacterModule {}
