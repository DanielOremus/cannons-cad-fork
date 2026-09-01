import { Command } from '@nestjs/cqrs';
import { UpdateUserDto } from '../../dto/update-user.dto.js';
import { PermissionScope, UserRole } from '@project/shared';

export class UpdateUserCommand extends Command<void> {
  constructor(
    readonly targetUserId: string,
    readonly dto: UpdateUserDto,
    readonly currentUserRoles: UserRole[],
    readonly scope: PermissionScope,
  ) {
    super();
  }
}
