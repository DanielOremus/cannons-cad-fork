import { Query } from '@nestjs/cqrs';
import { PermissionScope } from '@project/shared';
import { UserDto } from '../../dto/get-user.dto';

export class GetUserQuery extends Query<UserDto> {
  constructor(
    readonly userId: string,
    readonly permissionScope: PermissionScope,
  ) {
    super();
  }
}
