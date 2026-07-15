import { Controller, Get, Res } from '@nestjs/common';
import { type Response, type Request } from 'express';
import { UserService } from './user.service';
import { type PaginationDto } from '@project/shared';
import { randomUUID } from 'crypto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/me')
  async me(@Res() res: Response<{}, {}>) {
    const user = await this.userService.getById(randomUUID());
    return user;
  }
  // @Get()
  // async findAll(@Query() query: PaginationDto) {
  //   const users = await this.userService.getPaginatedList(query);
  // }
}
