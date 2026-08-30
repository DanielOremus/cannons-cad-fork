import { hasHigherOrSamePriority, getStaffPriority } from '@project/shared';
import { UnitOfWork } from '../../../../core/database/unit-of-work';
import { ForbiddenError, NotFoundError } from '../../../../shared/errors/app.error';
import { UserRepository } from '../../user.repository';
import { UpdateUserCommand } from './update-user.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthCacheService } from '../../../../shared/modules/auth-cache/auth-cache.service';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authCache: AuthCacheService,
    private readonly uow: UnitOfWork,
  ) {}
  async execute(command: UpdateUserCommand): Promise<void> {
    //ensure current user can update any user
    if (command.scope !== 'any') throw new ForbiddenError();

    let targetUser = await this.userRepository.findById(command.targetUserId);
    if (!targetUser) throw new NotFoundError('User');

    //ensure we're not editing the higher or same priority staff member
    const currentUserPriority = Math.max(...command.currentUserRoles.map(getStaffPriority));
    // prettier-ignore
    if (hasHigherOrSamePriority(targetUser.roles, currentUserPriority))
      throw new ForbiddenError();

    //ensure new roles have lower priorities than current user's
    if (command.dto.roles && hasHigherOrSamePriority(command.dto.roles, currentUserPriority))
      throw new ForbiddenError();

    targetUser = await this.userRepository.update(targetUser, command.dto);

    await this.authCache.cacheUserRoles(targetUser.id, targetUser.roles);

    await this.uow.saveChanges();
  }
}
