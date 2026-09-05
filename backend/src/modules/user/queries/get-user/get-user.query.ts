import { Query } from '@nestjs/cqrs';
import { PermissionMeta } from '@project/shared';
import { UserDto } from '../../dto/get-user.dto.js';

export class GetUserQuery extends Query<UserDto> {
  constructor(
    readonly userId: string,
    readonly permissionMeta: PermissionMeta,
  ) {
    super();
  }
}
