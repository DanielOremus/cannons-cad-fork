import { Controller, Get } from '@nestjs/common';
import { RequirePermission } from '../../common/decorators/require-permission.decorator.js';
import { GetAuthUser } from '../../common/decorators/get-auth.user.decorator.js';
import type { AuthUser } from '../../shared/types/user.js';
import { UnitMemberService } from './unit-member.service.js';
import { GetPermissionMeta } from '../../common/decorators/get-permission-meta.decorator.js';
import type { PermissionMeta } from '@project/shared';

@Controller('/unit-members')
export class UnitMemberController {
  constructor(private readonly unitMemberService: UnitMemberService) {}
  @Get('/me')
  @RequirePermission('unit', 'read')
  async me(@GetAuthUser() user: AuthUser, @GetPermissionMeta() permissionMeta: PermissionMeta) {
    return await this.unitMemberService.findByUserId(user.id, user.id, permissionMeta);
  }
}
