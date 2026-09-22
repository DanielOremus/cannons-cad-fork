import { hasHigherOrSamePriority, getStaffPriority, UserStatus } from '@project/shared';
import { UnitOfWork } from '../../../../core/database/unit-of-work.js';
import { ForbiddenError, NotFoundError } from '../../../../shared/errors/app.error.js';
import { UserRepository } from '../../user.repository.js';
import { UpdateUserCommand } from './update-user.command.js';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthCacheService } from '../../../../shared/modules/auth-cache/auth-cache.service.js';
import { getScopesOrThrow } from '../../../../shared/utils/permission.helpers.js';
import { EventBus } from '../../../../shared/modules/event/event.bus.js';
import { Events } from '../../../../shared/constants/events.js';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authCache: AuthCacheService,
    private readonly eventBus: EventBus,
    private readonly uow: UnitOfWork,
  ) {}
  async execute(command: UpdateUserCommand): Promise<void> {
    //ensure current user can update any user
    const scopes = getScopesOrThrow(command.permissionMeta);
    if (!scopes.includes('any')) throw new ForbiddenError();

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
    await this.uow.saveChanges();

    await this.authCache.cacheUserRoles(targetUser.id, targetUser.roles);
    //TODO: fallback if caching fails

    if (command.dto.roles || (command.dto.status && command.dto.status !== UserStatus.APPROVED))
      this.eventBus.emit(Events.USER_PERMISSIONS_CHANGED, { userId: targetUser.id });
    //TODO: add listener for user permissions changed
  }
}
