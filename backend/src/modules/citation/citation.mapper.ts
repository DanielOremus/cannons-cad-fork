import { Injectable } from '@nestjs/common';
import { ChargeMapper } from './charge.mapper';
import { CitationEntity } from './entities/citation.entity';
import { CitationDto } from './dto/get-citation.dto';

@Injectable()
export class CitationMapper {
  constructor(
    private readonly chargeMapper: ChargeMapper,
    // private readonly vehicleMapper: string,
  ) {}
  toReadDto(citation: CitationEntity): CitationDto {
    return {
      issuedAt: citation.issuedAt,
      issuedVehicle: citation.issuedVehicle,
      charges: this.chargeMapper.toDtoList(Array.from(citation.charges)),
    };
  }
  toDtoList(citations: CitationEntity[]) {
    return citations.map((c) => this.toReadDto(c));
  }
}
