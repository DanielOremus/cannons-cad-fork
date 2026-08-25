import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/shared';
import { CitationEntity } from './entities/citation.entity';
import { CreateCitationInput } from './inputs/create-citation.input';

@Injectable()
export abstract class CitationRepository {
  abstract findByCharacter(
    characterId: number,
    pagination: PaginationDto,
  ): Promise<{ items: CitationEntity[]; total: number }>;
  abstract issue(input: CreateCitationInput): Promise<CitationEntity>;
}
