import { Controller, Post } from '@nestjs/common';
import { type PermissionMeta } from '@project/shared';
import { DutyService } from './duty.service.js';
import { RequirePermission } from '../../common/decorators/require-permission.decorator.js';
import { GetPermissionMeta } from '../../common/decorators/get-permission-meta.decorator.js';
import { GetAuthUser } from '../../common/decorators/get-auth.user.decorator.js';
import { type AuthUser } from '../../shared/types/user.js';

@Controller('/duty')
export class DutyController {
  constructor(private readonly dutyService: DutyService) {}

  @Post('/end')
  @RequirePermission('duty', 'end')
  async start(@GetAuthUser() user: AuthUser, @GetPermissionMeta() permissionMeta: PermissionMeta) {}
}
