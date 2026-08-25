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

const queryHandlers = [GetCharacterCitationsHandler];
const commandHandlers = [IssueCitationHandler];

@Module({
  controllers: [CitationController],
  imports: [
    MikroOrmModule.forFeature([CitationEntity, ChargeEntity]),
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
