import { Injectable } from '@nestjs/common';
import { RedisService } from '../../core/redis/redis.service.js';
import { randomUUID } from 'crypto';
import { UnitRepository } from '../unit/unit.repository.js';
import { UnitMemberRepository } from '../unit-member/unit-member.repository.js';
import { getContextsOrThrow } from '../../shared/utils/permission.helpers.js';
import { ConflictError, ForbiddenError, NotFoundError } from '../../shared/errors/app.error.js';
import { ErrorCode, PermissionMeta } from '@project/shared';
import { EventBus } from '../../shared/modules/event/event.bus.js';
import { JoinRequestData } from '../../shared/types/unit-join-request.js';
import { UnitOfWork } from '../../core/database/unit-of-work.js';
import { type UnitMemberEntity } from '../unit-member/entities/unit-member.entity.js';
import { UnitMemberMapper } from '../unit-member/unit-member.mapper.js';

@Injectable()
export class UnitJoinRequestService {
  private readonly requestTtl = 30000;
  private joinRequestKey(requestId: string) {
    return `unit-join-requests:${requestId}`;
  }
  private userRequestRelationKey(userId: string) {
    return `users:${userId}:unit-join-request`;
  }
  private async create(joinUnitId: number, fromUserId: string, toUserId: string) {
    const requestId = randomUUID();
    const data = JSON.stringify({ joinUnitId, toUserId, fromUserId } satisfies JoinRequestData);
    const requestPromise = this.redis.client.setEx(
      this.joinRequestKey(requestId),
      this.requestTtl,
      data,
    );
    const relationPromise = this.redis.client.setEx(
      this.userRequestRelationKey(fromUserId),
      this.requestTtl,
      requestId,
    );

    await Promise.all([requestPromise, relationPromise]);
    return requestId;
  }

  private async getRequestData(requestId: string) {
    const data = await this.redis.client.get(this.joinRequestKey(requestId));
    return data ? (JSON.parse(data) as JoinRequestData) : null;
  }
  private async exists(userId: string) {
    return await this.redis.client.exists(this.userRequestRelationKey(userId));
  }
  private async delete(requestId: string, issuerId: string) {
    await this.redis.client.unlink([
      this.joinRequestKey(requestId),
      this.userRequestRelationKey(issuerId),
    ]);
  }
  private async validateJoinRequest(requestId: string, userId: string) {
    const data = await this.getRequestData(requestId);
    if (!data) throw new NotFoundError('Join request');

    const { joinUnitId, toUserId: leaderId } = data;
    if (leaderId !== userId) throw new ForbiddenError('Must be a unit leader');

    const unit = await this.unitRepository.findById(joinUnitId);
    if (!unit) throw new NotFoundError('Unit not found');

    return { request: data, unit };
  }

  constructor(
    private readonly redis: RedisService,
    private readonly unitRepository: UnitRepository,
    private readonly unitMemberRepository: UnitMemberRepository,
    private readonly unitMemberMapper: UnitMemberMapper,
    private readonly eventBus: EventBus,
    private readonly uow: UnitOfWork,
  ) {}

  async send(unitId: number, userId: string, permissionMeta: PermissionMeta) {
    const contexts = getContextsOrThrow(permissionMeta);

    const unit = await this.unitRepository.findById(unitId, ['members']);
    if (!unit) throw new NotFoundError('Unit');
    //Check whether user can join to unit with specific duty
    if (!contexts.includes(unit.duty))
      throw new ForbiddenError(`Cannot join to unit with '${unit.duty}' duty`);

    const ownMember = await this.unitMemberRepository.findByUser(userId, ['user']);
    if (!ownMember) throw new NotFoundError('Member');
    //Does send request to own unit?
    if (ownMember.unit?.id === unit.id)
      throw new ConflictError('Cannot send request to own unit', ErrorCode.CONFLICT);
    //Is request already pending?
    const alreadyPending = await this.exists(userId);
    if (alreadyPending)
      throw new ConflictError('Join request is already pending', ErrorCode.ALREADY_EXISTS);
    //Find the unit leader
    const unitLeader = Array.from(unit.members).reduce<UnitMemberEntity | null>((acc, unit) => {
      if (!unit.lastJoinAt) return acc;
      if (!acc) return unit;
      if (acc.lastJoinAt && unit.lastJoinAt < acc.lastJoinAt) return unit;
      return acc;
    }, null);
    if (!unitLeader) throw new NotFoundError('Unit leader');
    //Send request to the leader
    const requestId = await this.create(unit.id, ownMember.user.id, unitLeader.user.id);
    this.eventBus.emit('unit.join.sent', {
      requestId,
      fromUser: {
        id: ownMember.user.id,
        name: ownMember.user.name,
        memberName: ownMember.name,
      },
      toUser: {
        memberId: unitLeader.id,
      },
    });
  }
  async accept(requestId: string, userId: string) {
    const { request, unit } = await this.validateJoinRequest(requestId, userId);

    const memberToAdd = await this.unitMemberRepository.findByUser(request.fromUserId);
    if (!memberToAdd) throw new NotFoundError('Member');

    await this.unitMemberRepository.update(memberToAdd, { unit: unit.id });
    await this.uow.saveChanges();

    await this.delete(requestId, request.fromUserId);

    this.eventBus.emit('unit.join.accepted', {
      userId: request.fromUserId,
      unitId: unit.id,
      member: this.unitMemberMapper.toReadDto(memberToAdd),
      duty: unit.duty,
    });
  }
  async decline(requestId: string, userId: string) {
    const { request } = await this.validateJoinRequest(requestId, userId);

    await this.delete(requestId, request.fromUserId);

    this.eventBus.emit('unit.join.declined', { userId: request.fromUserId });
  }
}
