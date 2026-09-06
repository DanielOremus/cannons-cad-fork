import { Query } from '@nestjs/cqrs';
import { PaginatedList, PermissionMeta } from '@project/shared';
import { UserDto } from '../../dto/get-user.dto.js';
import { UsersFilterDto } from '../../dto/get-users-filter.dto.js';

export class GetUsersListQuery extends Query<PaginatedList<UserDto>> {
  constructor(
    readonly queryParams: UsersFilterDto,
    readonly permissionMeta: PermissionMeta,
  ) {
    super();
  }
}
