import { ChargeDto } from '@project/shared';
import { ChargeEntity } from './entities/charge.entity.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChargeMapper {
  toReadDto(charge: ChargeEntity): ChargeDto {
    return {
      reason: charge.reason,
      amount: charge.amount,
      count: charge.count,
      jailTime: charge.jailTime,
    };
  }
  toDtoList(charges: ChargeEntity[]): ChargeDto[] {
    return charges.map((charge) => this.toReadDto(charge));
  }
}
