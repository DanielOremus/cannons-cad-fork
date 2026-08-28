import { Query } from '@nestjs/cqrs';
import { PaginatedList, PermissionScope } from '@project/shared';
import { UserDto } from '../../dto/get-user.dto';
import { UsersFilterDto } from '../../dto/get-users-filter.dto';

export class GetUsersListQuery extends Query<PaginatedList<UserDto>> {
  constructor(
    readonly queryParams: UsersFilterDto,
    readonly scope: PermissionScope,
  ) {
    super();
  }
}
