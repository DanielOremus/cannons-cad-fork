import { Injectable, Logger } from '@nestjs/common';
import { IncidentRepository } from './incident.repository.js';
import { EventBus } from '../../shared/modules/event/event.bus.js';
import { PermissionMeta } from '@project/shared';
import { getScopesOrThrow } from '../../shared/utils/permission.helpers.js';
import { ForbiddenError, NotFoundError } from '../../shared/errors/app.error.js';
import { IncidentMapper } from './incident.mapper.js';
import { CreateIncidentDto } from './dto/create-incident.dto.js';
import { UnitOfWork } from '../../core/database/unit-of-work.js';
import { UpdateIncidentDto, UpdateIncidentUnitsDto } from './dto/update-incident.dto.js';
import { UnitRepository } from '../unit/unit.repository.js';
import { UnitMemberRepository } from '../unit-member/unit-member.repository.js';

@Injectable()
export class IncidentService {
  private readonly logger = new Logger(IncidentService.name);

  constructor(
    private readonly incidentRepository: IncidentRepository,
    private readonly incidentMapper: IncidentMapper,
    private readonly unitRepository: UnitRepository,
    private readonly unitMemberRepository: UnitMemberRepository,
    private readonly uow: UnitOfWork,
    private readonly eventBust: EventBus,
  ) {}

  async getList(permissionMeta: PermissionMeta) {
    const scopes = getScopesOrThrow(permissionMeta);
    if (!scopes.includes('any')) throw new ForbiddenError();

    const { items, total } = await this.incidentRepository.findMany([
      'attachedUnits',
      'attachedUnits.members',
      'notes',
    ]);

    return this.incidentMapper.toListDto(Array.from(items));
  }

  async create(dto: CreateIncidentDto) {
    //checkUnits exists
    let unitsToAdd = dto.attachedUnits;
    if (dto.attachedUnits.length > 0) {
      const units = await this.unitRepository.findMany({ ids: dto.attachedUnits });
      if (unitsToAdd.length !== units.length) {
        unitsToAdd = [];

        const foundIdsSet = new Set(units.map((e) => e.id));
        for (const unitId of dto.attachedUnits) {
          if (foundIdsSet.has(unitId)) unitsToAdd.push(unitId);
          else this.logger.warn(`Could not add unit '${unitId}', as it does not exist`);
        }
      }
    }

    const incident = await this.incidentRepository.create({ ...dto, attachedUnits: unitsToAdd });
    await this.uow.saveChanges();

    //emit event

    return this.incidentMapper.toReadDto(incident);
  }

  async update(incidentId: number, dto: UpdateIncidentDto, permissionMeta: PermissionMeta) {
    const scopes = getScopesOrThrow(permissionMeta);
    if (!scopes.includes('any')) throw new ForbiddenError();

    let incident = await this.incidentRepository.findById(incidentId, ['notes', 'attachedUnits']);
    if (!incident) throw new NotFoundError('Incident');

    incident = await this.incidentRepository.update(incident, dto);
    await this.uow.saveChanges();

    //emit event

    return this.incidentMapper.toReadDto(incident);
  }

  async manageUnits(dto: UpdateIncidentUnitsDto, permissionMeta: PermissionMeta) {
    const scopes = getScopesOrThrow(permissionMeta);
    if (!scopes.includes('any')) throw new ForbiddenError();
  }
}
