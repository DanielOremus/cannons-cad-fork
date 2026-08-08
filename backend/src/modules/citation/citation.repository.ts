import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/shared';
import { CitationEntity } from './entities/citation.entity';

@Injectable()
export abstract class CitationRepository {
  abstract findByCharacter(
    characterId: number,
    pagination: PaginationDto,
  ): Promise<{ items: CitationEntity[]; total: number }>;
  abstract countByCharacter(characterId: number): Promise<number>;
}
