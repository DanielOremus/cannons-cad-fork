import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import { UserService } from './user.service';
import { type PaginationDto } from '@project/shared';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Controller('/users')
@UseGuards(AuthGuard, PermissionsGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/me')
  @RequirePermission('user', 'read')
  async me(@Req() req: Request) {
    const id = req.user!.id;
    return await this.userService.getProfile(id, id, req.permissionScope!);
  }
  @Get('/:id')
  @RequirePermission('user', 'read')
  async getById(@Req() req: Request, @Param('id') id: string) {
    const currentUserId = req.user!.id;
    return await this.userService.getProfile(id, currentUserId, req.permissionScope!);
  }
}
