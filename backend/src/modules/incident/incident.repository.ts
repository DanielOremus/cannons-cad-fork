import { PaginationDto } from '@project/shared';
import { IncidentEntity } from './entities/incident.entity.js';
import { CollectionResult } from '../../shared/types/collection.js';
import { CreateIncidentInput } from './inputs/create-incident.input.js';
import { UpdateIncidentInput } from './inputs/update-incident.input.js';
import { IncidentNoteEntity } from './entities/incident-note.entity.js';
import { Injectable } from '@nestjs/common';
import { CreateIncidentNoteInput } from './inputs/note/create-incident-note.input.js';

export type IncidentPopulate = 'notes' | 'attachedUnits' | 'attachedUnits.members';

@Injectable()
export abstract class IncidentRepository {
  abstract findMany(
    populate?: IncidentPopulate[],
    pagination?: PaginationDto,
  ): Promise<CollectionResult<IncidentEntity>>;
  abstract findById(id: number, populate?: IncidentPopulate[]): Promise<IncidentEntity | null>;
  abstract create(input: CreateIncidentInput): Promise<IncidentEntity>;
  abstract update(entity: IncidentEntity, input: UpdateIncidentInput): Promise<IncidentEntity>;
  abstract addNote(note: CreateIncidentNoteInput): Promise<IncidentNoteEntity>;
  abstract delete(entity: IncidentEntity): Promise<void>;
}
