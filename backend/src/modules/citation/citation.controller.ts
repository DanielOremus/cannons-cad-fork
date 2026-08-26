import { Body, Controller, Delete, HttpCode, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CommandBus } from '@nestjs/cqrs';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateCitationDto } from './dto/create-citation.dto';
import { IssueCitationCommand } from './commands/issue-citation/issue-citation.command';
import { type Request } from 'express';
import { IdParamPipe } from '../../common/pipes/id-validation.pipe';
import { DeleteCitationCommand } from './commands/delete-citation/delete-citation.command';

@Controller('/citations')
@UseGuards(AuthGuard, PermissionsGuard)
export class CitationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/issue')
  @RequirePermission('citation', 'create')
  @HttpCode(201)
  async issue(
    @Req() req: Request,
    @Body(new ZodValidationPipe(CreateCitationDto.schema)) dto: CreateCitationDto,
  ) {
    await this.commandBus.execute(new IssueCitationCommand(dto, req.user!.id));
  }
  @Delete('/:id')
  @RequirePermission('citation', 'delete')
  @HttpCode(204)
  async delete(@Req() req: Request, @Param('id', new IdParamPipe()) id: number) {
    await this.commandBus.execute(
      new DeleteCitationCommand(id, req.user!.id, req.permissionScope!),
    );
  }
}
