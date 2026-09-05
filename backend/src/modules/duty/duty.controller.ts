import { Req, Controller, Post, Body } from '@nestjs/common';
import { type StartDutyDto, startDutySchema } from '@project/shared';
import { type Request } from 'express';
import { DutyService } from './duty.service.js';
import { RequirePermission } from '../../common/decorators/require-permission.decorator.js';

@Controller('/duty')
export class DutyController {
  constructor(private readonly dutyService: DutyService) {}

  @Post('/start')
  @RequirePermission()
  async start(@Req() req: Request, @Body({ schema: startDutySchema }) dto: StartDutyDto) {
    return await this.dutyService.start(dto);
  }
}
