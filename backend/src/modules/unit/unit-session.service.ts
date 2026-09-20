import { Injectable } from '@nestjs/common';
import { UnitMemberRepository } from '../unit-member/unit-member.repository.js';
import { Rooms } from '../../core/socket/rooms.js';
import { DutyType } from '@project/shared';
import { IRoomProvider } from '../../core/socket/room-provider.interface.js';

@Injectable()
export class UnitSessionService implements IRoomProvider {
  constructor(private readonly unitMemberRepository: UnitMemberRepository) {}

  async getRoomsForUser(userId: string): Promise<string[]> {
    const member = await this.unitMemberRepository.findByUser(userId, ['unit']);
    if (!member || !member.unit) return [];

    const duty = member.unit.duty;
    const rooms = [Rooms.unit(member.unit.id), Rooms.unitMember(member.id)];
    if (duty === DutyType.DISPATCH) rooms.push(Rooms.dispatch);

    return rooms;
    // switch (duty) {
    //     case DutyType.DISPATCH:
    //         rooms.push(Rooms.dispatch)
    //         break;
    //     case DutyType.POLICE:
    //         rooms.push
    //     default:
    //         break;
    // }
  }
}
