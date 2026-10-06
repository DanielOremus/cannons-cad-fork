import { Injectable } from '@nestjs/common';
import { IncidentEntity } from './entities/incident.entity.js';
import { IncidentDto } from '@project/shared';
import { UnitMapper } from '../unit/unit.mapper.js';

@Injectable()
export class IncidentMapper {
  constructor(private readonly unitMapper: UnitMapper) {}

  toReadDto(incident: IncidentEntity): IncidentDto {
    const {
      id,
      title,
      status,
      priority = null,
      origin,
      code,
      address,
      postal = null,
      description = null,
      attachedUnits,
      notes,
    } = incident;
    return {
      id,
      title,
      priority,
      origin,
      status,
      code,
      address,
      postal,
      description,
      attachedUnits: this.unitMapper.toListDto(Array.from(attachedUnits)),
      notes: notes.map(({ id, text, author, createdAt }) => ({
        id,
        text,
        author,
        createdAt,
      })),
    };
  }

  toListDto(incidents: IncidentEntity[]): IncidentDto[] {
    return incidents.map((i) => this.toReadDto(i));
  }
}
