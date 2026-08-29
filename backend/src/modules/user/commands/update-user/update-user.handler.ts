import { getPermissionsFromRoles } from '@project/shared';
import { UnitOfWork } from '../../../../core/database/unit-of-work';
import { ForbiddenError, NotFoundError } from '../../../../shared/errors/app.error';
import { UserRepository } from '../../user.repository';
import { UpdateUserCommand } from './update-user.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PermissionsCacheService } from '../../../../shared/modules/permissions/permissions-cache.service';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly uow: UnitOfWork,
    private readonly permissionsCache: PermissionsCacheService,
  ) {}
  async execute(command: UpdateUserCommand): Promise<void> {
    const user = await this.userRepository.findById(command.userId);
    if (!user) throw new NotFoundError('User');

    if (command.scope !== 'any') throw new ForbiddenError();

    const updatedUser = await this.userRepository.update(user, command.dto);

    const permissions = Array.from(getPermissionsFromRoles(...updatedUser.roles));
    await this.permissionsCache.cacheUserPermissions(command.userId, permissions);

    await this.uow.saveChanges();
  }
}
