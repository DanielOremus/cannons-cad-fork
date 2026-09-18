import { Controller, HttpCode, Param, Post } from '@nestjs/common';
import { UnitJoinRequestService } from './unit-join-request.service.js';
import { RequirePermission } from '../../common/decorators/require-permission.decorator.js';
import { GetAuthUser } from '../../common/decorators/get-auth.user.decorator.js';
import { GetPermissionMeta } from '../../common/decorators/get-permission-meta.decorator.js';
import type { AuthUser } from '../../shared/types/user.js';
import type { PermissionMeta } from '@project/shared';
import { IdParamPipe, UuidParamPipe } from '../../common/pipes/id-validation.pipe.js';

@Controller('/unit-join-requests')
export class UnitJoinRequestController {
  constructor(private readonly joinRequestService: UnitJoinRequestService) {}

  @Post('/:unitId/send')
  @HttpCode(200)
  @RequirePermission('duty', 'start')
  async sendJoinRequest(
    @Param('unitId', IdParamPipe) unitId: number,
    @GetAuthUser() user: AuthUser,
    @GetPermissionMeta() permissionMeta: PermissionMeta,
  ) {
    await this.joinRequestService.send(unitId, user.id, permissionMeta);
  }
  @Post('/:requestId/accept')
  @HttpCode(204)
  @RequirePermission('unit', 'update')
  async acceptJoinRequest(
    @Param('requestId', UuidParamPipe) requestId: string,
    @GetAuthUser() user: AuthUser,
  ) {
    await this.joinRequestService.accept(requestId, user.id);
  }
  @Post('/:requestId/decline')
  @RequirePermission('unit', 'update')
  @HttpCode(204)
  async declineJoinRequest(
    @Param('requestId', UuidParamPipe) requestId: string,
    @GetAuthUser() user: AuthUser,
  ) {
    await this.joinRequestService.decline(requestId, user.id);
  }
}
