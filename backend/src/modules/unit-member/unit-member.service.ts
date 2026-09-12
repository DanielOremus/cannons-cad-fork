import { Injectable } from '@nestjs/common';
import { UnitMemberRepository } from './unit-member.repository.js';
import { UnitOfWork } from '../../core/database/unit-of-work.js';
import { CreateUnitMemberDto } from './dto/create-unit-member.dto.js';
import { UnitMemberMapper } from './unit-member.mapper.js';
import { OwnershipService } from '../../shared/modules/ownership/ownership.service.js';
import { PermissionMeta } from '@project/shared';
import { getScopesOrThrow } from '../../shared/utils/permission.helpers.js';
import { NotFoundError } from '../../shared/errors/app.error.js';

@Injectable()
export class UnitMemberService {
  constructor(
    private readonly unitMemberRepository: UnitMemberRepository,
    private readonly unitMemberMapper: UnitMemberMapper,
    private readonly ownershipService: OwnershipService,
    private readonly uow: UnitOfWork,
  ) {}
  async findByUserId(targetUserId: string, currentUserId: string, permissionMeta: PermissionMeta) {
    const scopes = getScopesOrThrow(permissionMeta);
    if (!scopes.includes('any')) this.ownershipService.checkProfile(targetUserId, currentUserId);

    const member = await this.unitMemberRepository.findByUserId(targetUserId);
    if (!member) throw new NotFoundError('Member');

    return this.unitMemberMapper.toReadDto(member);
  }
  async findOrCreate(dto: CreateUnitMemberDto, userId: string) {
    let member = await this.unitMemberRepository.findByUserId(userId);

    if (!member) {
      const { name, rank } = dto;
      member = await this.unitMemberRepository.create({ name, rank, user: userId });
      await this.uow.saveChanges();
    }

    return this.unitMemberMapper.toReadDto(member);
  }
}
