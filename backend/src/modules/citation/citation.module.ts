import { Module } from '@nestjs/common';
import { CitationRepository } from './citation.repository';
import { OrmCitationRepository } from './infrastructure/orm.citation.repository';
import { ChargeMapper } from './charge.mapper';
import { GetCharacterCitationsHandler } from './queries/get-character-citations/get-character-citations.handler';
import { CitationMapper } from './citation.mapper';

const queryHandlers = [GetCharacterCitationsHandler];

@Module({
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
