import { Command } from '@nestjs/cqrs';
import { PermissionMeta } from '@project/shared';
import { UpdateCitationDto } from '../../dto/update-citation.dto.js';

export class UpdateCitationCommand extends Command<void> {
  constructor(
    readonly id: number,
    readonly dto: UpdateCitationDto,
    readonly userId: string,
    readonly permissionMeta: PermissionMeta,
  ) {
    super();
  }
}
