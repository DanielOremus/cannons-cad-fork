import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import { uuidValidator, type PaginationDto } from '@project/shared';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { QueryBus } from '@nestjs/cqrs';
import { GetOwnProfileQuery } from './queries/get-own-profile/get-own-profile.query';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { GetUserQuery } from './queries/get-user/get-user.query';

@Controller('/users')
@UseGuards(AuthGuard, PermissionsGuard)
export class UserController {
  constructor(private readonly queryBus: QueryBus) {}
  @Get('/me')
  @RequirePermission('user', 'read')
  async me(@Req() req: Request) {
    const id = req.user!.id;
    return await this.queryBus.execute(new GetOwnProfileQuery(id));
  }
  @Get('/:id')
  @RequirePermission('user', 'read')
  async getById(
    @Req() req: Request,
    @Param('id', new ZodValidationPipe(uuidValidator)) id: string,
  ) {
    return await this.queryBus.execute(new GetUserQuery(id, req.permissionScope!));
  }
}
