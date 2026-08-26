import { Command } from '@nestjs/cqrs';
import { PermissionScope } from '@project/shared';
import { UpdateCitationDto } from '../../dto/update-citation.dto';

export class UpdateCitationCommand extends Command<void> {
  constructor(
    readonly id: number,
    readonly dto: UpdateCitationDto,
    readonly userId: string,
    readonly scope: PermissionScope,
  ) {
    super();
  }
}
