import { ChargeDto as ReadDto } from '@project/shared';

export class ChargeDto implements ReadDto {
  amount: number;
  reason: string;
  jailTime: string | null;
  count: number;
}
