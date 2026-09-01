import { Injectable } from '@nestjs/common';
import { ChargeMapper } from './charge.mapper.js';
import { CitationEntity } from './entities/citation.entity.js';
import { CitationDto } from './dto/get-citation.dto.js';

@Injectable()
export class CitationMapper {
  constructor(private readonly chargeMapper: ChargeMapper) {}
  toReadDto(citation: CitationEntity): CitationDto {
    return {
      id: citation.id,
      charges: this.chargeMapper.toDtoList(Array.from(citation.charges)),
      status: citation.status,
      issuedVehicle: citation.issuedVehicle,
      issuedBy: citation.issuedBy ? { name: citation.issuedBy.name } : null,
      issuedAt: citation.issuedAt,
    };
  }
  toDtoList(citations: CitationEntity[]) {
    return citations.map((c) => this.toReadDto(c));
  }
}
