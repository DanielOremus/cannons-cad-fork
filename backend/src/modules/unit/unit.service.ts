import { Injectable } from '@nestjs/common';
import { UnitRepository } from './unit.repository.js';
import { UpdateUnitStatusDto } from './dto/update-unit.js';
import { PermissionScope, UnitStatus } from '@project/shared';
import { EventBus } from '../../shared/modules/event/event.bus.js';

@Injectable()
export class UnitService {
  constructor(
    private readonly unitRepository: UnitRepository,
    private readonly eventBus: EventBus,
  ) {}
  async updateStatus(
    dto: UpdateUnitStatusDto,
    unitId: number,
    userId: string,
    scope: PermissionScope,
  ): Promise<void> {
    // redis
    //event manager .emit ("unit-update", unit)
    this.eventBus.emit('unit.status.updated', { id: 1, status: UnitStatus.AVAILABLE });
  }
}
