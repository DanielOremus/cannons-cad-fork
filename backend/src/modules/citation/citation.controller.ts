import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CommandBus } from '@nestjs/cqrs';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateCitationDto } from './dto/create-citation.dto';
import { IssueCitationCommand } from './commands/issue-citation/issue-citation.command';

@Controller('/citations')
@UseGuards(AuthGuard, PermissionsGuard)
export class CitationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/issue')
  @RequirePermission('citation', 'create')
  @HttpCode(201)
  async issue(@Body(new ZodValidationPipe(CreateCitationDto.schema)) dto: CreateCitationDto) {
    await this.commandBus.execute(new IssueCitationCommand(dto));
  }
}
