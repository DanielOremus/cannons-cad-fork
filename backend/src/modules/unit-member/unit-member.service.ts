import { Injectable } from '@nestjs/common';
import { UnitMemberRepository } from './unit-member.repository.js';
import { UnitOfWork } from '../../core/database/unit-of-work.js';
import { CreateUnitMemberDto } from './dto/create-unit-member.dto.js';
import { UnitMemberMapper } from './unit-member.mapper.js';
import { ErrorCode } from '@project/shared';
import { ConflictError, NotFoundError } from '../../shared/errors/app.error.js';

@Injectable()
export class UnitMemberService {
  constructor(
    private readonly unitMemberRepository: UnitMemberRepository,
    private readonly unitMemberMapper: UnitMemberMapper,
    private readonly uow: UnitOfWork,
  ) {}
  async findOwn(userId: string) {
    const member = await this.unitMemberRepository.findByUser(userId);
    if (!member) throw new NotFoundError('Member');

    return this.unitMemberMapper.toReadDto(member);
  }
  async create(dto: CreateUnitMemberDto, userId: string) {
    let member = await this.unitMemberRepository.findByUser(userId);
    if (member) throw new ConflictError('Member already exists', ErrorCode.ALREADY_EXISTS);

    const { name, rank } = dto;
    member = await this.unitMemberRepository.create({ name, rank, user: userId });
    await this.uow.saveChanges();

    return this.unitMemberMapper.toReadDto(member);
  }
}
