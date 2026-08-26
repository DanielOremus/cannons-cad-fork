import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { UpdateCitationDto } from './dto/update-citation.dto';
import { UpdateCitationCommand } from './commands/update-citation/update-citation.command';

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
  @Patch('/:id')
  @RequirePermission('citation', 'update')
  async update(
    @Req() req: Request,
    @Param('id', new IdParamPipe()) id: number,
    @Body(new ZodValidationPipe(UpdateCitationDto.schema)) dto: UpdateCitationDto,
  ) {
    await this.commandBus.execute(
      new UpdateCitationCommand(id, dto, req.user!.id, req.permissionScope!),
    );
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
