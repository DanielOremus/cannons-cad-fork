import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { RequirePermission } from '../../common/decorators/require-permission.decorator.js';
import { GetAuthUser } from '../../common/decorators/get-auth.user.decorator.js';
import type { AuthUser } from '../../shared/types/user.js';
import { UnitMemberService } from './unit-member.service.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { CreateUnitMemberDto } from './dto/create-unit-member.dto.js';

@Controller('/unit-members')
export class UnitMemberController {
  constructor(private readonly unitMemberService: UnitMemberService) {}
  @Get('/me')
  @RequirePermission('unit', 'read')
  async me(@GetAuthUser() user: AuthUser) {
    return await this.unitMemberService.findOwn(user.id);
  }
  @Post('/create')
  @HttpCode(201)
  @RequirePermission('unit', 'create')
  async create(
    @Body(new ZodValidationPipe(CreateUnitMemberDto.schema)) dto: CreateUnitMemberDto,
    @GetAuthUser() user: AuthUser,
  ) {
    return await this.unitMemberService.create(dto, user.id);
  }
}
