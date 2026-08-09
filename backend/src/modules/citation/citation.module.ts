import { Module } from '@nestjs/common';
import { CitationRepository } from './citation.repository';
import { OrmCitationRepository } from './infrastructure/orm.citation.repository';
import { ChargeMapper } from './charge.mapper';

@Module({
  providers: [
    {
      provide: CitationRepository,
      useClass: OrmCitationRepository,
    },
    ChargeMapper,
  ],
  exports: [CitationRepository],
})
export class CitationModule {}
