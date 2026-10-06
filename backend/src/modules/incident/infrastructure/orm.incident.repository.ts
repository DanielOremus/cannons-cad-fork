import { PaginationDto } from '@project/shared';
import { CollectionResult } from '../../../shared/types/collection.js';
import { IncidentNoteEntity } from '../entities/incident-note.entity.js';
import { IncidentEntity } from '../entities/incident.entity.js';
import { IncidentPopulate, IncidentRepository } from '../incident.repository.js';
import { CreateIncidentInput } from '../inputs/create-incident.input.js';
import { UpdateIncidentInput } from '../inputs/update-incident.input.js';
import { EntityManager } from '@mikro-orm/postgresql';
import { CreateIncidentNoteInput } from '../inputs/note/create-incident-note.input.js';

export class OrmIncidentRepository implements IncidentRepository {
  private readonly entity = IncidentEntity;
  private readonly noteEntity = IncidentNoteEntity;
  constructor(private readonly em: EntityManager) {}

  async findMany(
    populate: IncidentPopulate[] = [],
    pagination?: PaginationDto,
  ): Promise<CollectionResult<IncidentEntity>> {
    const limit = pagination?.limit;
    const offset = !pagination ? undefined : (pagination.page - 1) * pagination.limit;
    const [items, total] = await this.em.findAndCount(
      this.entity,
      {},
      {
        populate,
        limit,
        offset,
      },
    );

    return { total, items };
  }
  async findById(id: number, populate: IncidentPopulate[] = []): Promise<IncidentEntity | null> {
    return await this.em.findOne(this.entity, { id }, { populate });
  }
  async create(input: CreateIncidentInput): Promise<IncidentEntity> {
    return await this.em.create(this.entity, input);
  }
  async update(entity: IncidentEntity, input: UpdateIncidentInput): Promise<IncidentEntity> {
    return await this.em.assign(entity, input);
  }
  async addNote(input: CreateIncidentNoteInput): Promise<IncidentNoteEntity> {
    return await this.em.create(this.noteEntity, input);
  }
  async delete(entity: IncidentEntity): Promise<void> {
    await this.em.remove(entity);
  }
}
