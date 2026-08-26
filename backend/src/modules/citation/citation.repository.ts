import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/shared';
import { CitationEntity } from './entities/citation.entity';
import { CreateCitationInput } from './inputs/create-citation.input';
import { UpdateCitationDto } from './dto/update-citation.dto';

@Injectable()
export abstract class CitationRepository {
  abstract findByCharacter(
    characterId: number,
    pagination: PaginationDto,
    populate?: CitationPopulate[],
  ): Promise<{ items: CitationEntity[]; total: number }>;
  abstract findById(id: number): Promise<CitationEntity | null>;
  abstract issue(input: CreateCitationInput): Promise<CitationEntity>;
  abstract update(entity: CitationEntity, input: UpdateCitationDto): Promise<CitationEntity>;
  abstract delete(entity: CitationEntity): Promise<void>;
}

export type CitationPopulate = 'issuedBy' | 'issuedCharacter' | 'issuedVehicle' | 'charges';
