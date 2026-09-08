import { Injectable } from '@nestjs/common';
import { PermissionMeta, StartDutyDto, UnitMemberDto } from '@project/shared';
import { getContextsOrThrow } from '../../shared/utils/permission.helpers.js';
import { ForbiddenError } from '../../shared/errors/app.error.js';
import { UnitRepository } from '../unit/unit.repository.js';
import { UnitOfWork } from '../../core/database/unit-of-work.js';
import { UnitMemberRepository } from '../unit-member/unit-member.repository.js';
import { UserRepository } from '../user/user.repository.js';
import { UnitMemberMapper } from '../unit-member/unit-member.mapper.js';

@Injectable()
export class DutyService {
  constructor(
    private readonly unitRepository: UnitRepository,
    private readonly unitMemberRepository: UnitMemberRepository,
    private readonly unitMemberMapper: UnitMemberMapper,
    private readonly uow: UnitOfWork,
  ) {}
  async start(
    dto: StartDutyDto,
    userId: string,
    permissionMeta: PermissionMeta,
  ): Promise<
    | {
        memberExists: true;
        data: UnitMemberDto;
      }
    | { memberExists: false; data: null }
  > {
    const userContexts = getContextsOrThrow(permissionMeta);
    if (!userContexts.includes(dto.duty))
      throw new ForbiddenError(`Cannot start '${dto.duty}' duty`);
    const unitMember = await this.unitMemberRepository.findByUserId(userId);

    return unitMember
      ? {
          memberExists: true,
          data: this.unitMemberMapper.toReadDto(unitMember),
        }
      : { memberExists: false, data: null };
  }
}
