import { Module } from '@nestjs/common';
import { CitationRepository } from './citation.repository.js';
import { OrmCitationRepository } from './infrastructure/orm.citation.repository.js';
import { ChargeMapper } from './charge.mapper.js';
import { GetCharacterCitationsHandler } from './queries/get-character-citations/get-character-citations.handler.js';
import { CitationMapper } from './citation.mapper.js';
import { CitationEntity } from './entities/citation.entity.js';
import { ChargeEntity } from './entities/charge.entity.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CitationController } from './citation.controller.js';
import { IssueCitationHandler } from './commands/issue-citation/issue-citation.handler.js';
import { CharacterModule } from '../character/character.module.js';
import { VehicleModule } from '../vehicle/vehicle.module.js';
import { DeleteCitationHandler } from './commands/delete-citation/delete-citation.handler.js';
import { OwnershipModule } from '../../shared/modules/ownership/ownership.module.js';
import { UpdateCitationHandler } from './commands/update-citation/update-citation.handler.js';

const queryHandlers = [GetCharacterCitationsHandler];
const commandHandlers = [IssueCitationHandler, DeleteCitationHandler, UpdateCitationHandler];

@Module({
  controllers: [CitationController],
  imports: [
    MikroOrmModule.forFeature([CitationEntity, ChargeEntity]),
    OwnershipModule,
    CitationModule,
    CharacterModule,
    VehicleModule,
  ],
  providers: [
    ...queryHandlers,
    ...commandHandlers,
    {
      provide: CitationRepository,
      useClass: OrmCitationRepository,
    },
    ChargeMapper,
    CitationMapper,
  ],
  exports: [CitationRepository],
})
export class CitationModule {}
