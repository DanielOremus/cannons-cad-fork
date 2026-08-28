import { Command } from '@nestjs/cqrs';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { PermissionScope } from '@project/shared';

export class UpdateUserCommand extends Command<void> {
  constructor(
    readonly dto: UpdateUserDto,
    readonly userId: string,
    readonly scope: PermissionScope,
  ) {
    super();
  }
}
