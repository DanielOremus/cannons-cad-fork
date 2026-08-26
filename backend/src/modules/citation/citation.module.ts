import { Module } from '@nestjs/common';
import { CitationRepository } from './citation.repository';
import { OrmCitationRepository } from './infrastructure/orm.citation.repository';
import { ChargeMapper } from './charge.mapper';
import { GetCharacterCitationsHandler } from './queries/get-character-citations/get-character-citations.handler';
import { CitationMapper } from './citation.mapper';
import { CitationEntity } from './entities/citation.entity';
import { ChargeEntity } from './entities/charge.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CitationController } from './citation.controller';
import { IssueCitationHandler } from './commands/issue-citation/issue-citation.handler';
import { CharacterModule } from '../character/character.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { DeleteCitationHandler } from './commands/delete-citation/delete-citation.handler';
import { OwnershipModule } from '../../shared/modules/ownership/ownership.module';
import { UpdateCitationHandler } from './commands/update-citation/update-citation.handler';

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
