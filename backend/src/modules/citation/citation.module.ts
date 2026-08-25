import { Module } from '@nestjs/common';
import { CitationRepository } from './citation.repository';
import { OrmCitationRepository } from './infrastructure/orm.citation.repository';
import { ChargeMapper } from './charge.mapper';
import { GetCharacterCitationsHandler } from './queries/get-character-citations/get-character-citations.handler';
import { CitationMapper } from './citation.mapper';
import { CitationEntity } from './entities/citation.entity';
import { ChargeEntity } from './entities/charge.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

const queryHandlers = [GetCharacterCitationsHandler];

@Module({
  imports: [MikroOrmModule.forFeature([CitationEntity, ChargeEntity])],
  providers: [
    ...queryHandlers,
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
