import { Injectable } from '@nestjs/common';
import { UnitRepository } from './unit.repository.js';
import { UpdateUnitStatusDto } from './dto/update-unit.dto.js';
import { PermissionMeta, UnitStatus } from '@project/shared';
import { EventBus } from '../../shared/modules/event/event.bus.js';
import { getScopesOrThrow } from '../../shared/utils/permission.helpers.js';
import { ForbiddenError } from '../../shared/errors/app.error.js';
import { UnitMapper } from './unit.mapper.js';

@Injectable()
export class UnitService {
  constructor(
    private readonly unitRepository: UnitRepository,
    private readonly unitMapper: UnitMapper,
    private readonly eventBus: EventBus,
  ) {}
  async getList(permissionMeta: PermissionMeta) {
    const scopes = getScopesOrThrow(permissionMeta);
    if (!scopes.includes('any')) throw new ForbiddenError();

    const units = await this.unitRepository.findMany();
    return this.unitMapper.toListDto(units);
  }
  async create() {}
  async updateStatus(dto: UpdateUnitStatusDto, unitId: number, userId: string): Promise<void> {
    // redis
    //event manager .emit ("unit-update", unit)
    this.eventBus.emit('unit.status.updated', { id: unitId, status: UnitStatus.AVAILABLE });
  }
}
