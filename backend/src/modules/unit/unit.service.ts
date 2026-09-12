import { Injectable } from '@nestjs/common';
import { UnitRepository } from './unit.repository.js';
import { UpdateUnitStatusDto } from './dto/update-unit.dto.js';
import {
  buildPermission,
  ErrorCode,
  hasPermissionFromSet,
  PermissionMeta,
  UnitStatus,
} from '@project/shared';
import { EventBus } from '../../shared/modules/event/event.bus.js';
import { getScopesOrThrow } from '../../shared/utils/permission.helpers.js';
import { ConflictError, ForbiddenError, NotFoundError } from '../../shared/errors/app.error.js';
import { UnitMapper } from './unit.mapper.js';
import { CreateUnitDto } from './dto/create-unit.dto.js';
import { UnitMemberRepository } from '../unit-member/unit-member.repository.js';
import { OwnershipService } from '../../shared/modules/ownership/ownership.service.js';
import { UnitOfWork } from '../../core/database/unit-of-work.js';
import { Events } from '../../shared/constants/events.js';
import { UnitsFilterDto } from './dto/get-units-filter.dto.js';
import { AuthUser } from '../../shared/types/user.js';

@Injectable()
export class UnitService {
  constructor(
    private readonly unitMemberRepository: UnitMemberRepository,
    private readonly unitRepository: UnitRepository,
    private readonly unitMapper: UnitMapper,
    private readonly ownershipService: OwnershipService,
    private readonly uow: UnitOfWork,
    private readonly eventBus: EventBus,
  ) {}
  async getList(filters: UnitsFilterDto, permissionMeta: PermissionMeta) {
    const scopes = getScopesOrThrow(permissionMeta);
    if (!scopes.includes('any')) throw new ForbiddenError();

    const units = await this.unitRepository.findMany(filters);
    return this.unitMapper.toListDto(units);
  }
  async create(dto: CreateUnitDto, user: AuthUser) {
    const hasDutyContext = hasPermissionFromSet(
      user.permissions,
      buildPermission('duty', 'start', dto.duty),
    );
    if (!hasDutyContext) throw new ForbiddenError(`Cannot start '${dto.duty}' duty`);

    const member = await this.unitMemberRepository.findById(dto.memberId);
    if (!member) throw new NotFoundError('Member');
    //owns member?
    this.ownershipService.checkUnitMember(member, user.id);
    //already in unit
    if (member.unit) throw new ConflictError('Already in unit', ErrorCode.CONFLICT);

    const unit = await this.uow.withTransaction(async () => {
      const unit = await this.unitRepository.create({
        callsign: dto.callsign,
        members: [member.id],
        status: dto.status,
      });
      await this.unitMemberRepository.update(member, { lastJoinAt: new Date(), unit: unit.id });

      return unit;
    });

    const mappedUnit = this.unitMapper.toReadDto(unit);

    this.eventBus.emit(Events.UNIT_CREATED, { unit: mappedUnit, userId: user.id });

    return mappedUnit;
  }
  async updateStatus(dto: UpdateUnitStatusDto, unitId: number, userId: string): Promise<void> {
    // redis
    //event manager .emit ("unit-update", unit)
    this.eventBus.emit(Events.UNIT_STATUS_UPDATED, { unitId, status: UnitStatus.AVAILABLE });
  }
}
