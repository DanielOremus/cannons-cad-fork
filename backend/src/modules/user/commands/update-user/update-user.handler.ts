import { getPermissionsFromRoles } from '@project/shared';
import { UnitOfWork } from '../../../../core/database/unit-of-work';
import { RedisService } from '../../../../core/redis/redis.service';
import { ForbiddenError, NotFoundError } from '../../../../shared/errors/app.error';
import { UserRepository } from '../../user.repository';
import { UpdateUserCommand } from './update-user.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly uow: UnitOfWork,
    private readonly redisService: RedisService,
  ) {}
  async execute(command: UpdateUserCommand): Promise<void> {
    const user = await this.userRepository.findById(command.userId);
    if (!user) throw new NotFoundError('User');

    if (command.scope !== 'any') throw new ForbiddenError();

    const roles = command.dto.roles;
    if (roles) {
      const permissions = Array.from(getPermissionsFromRoles(...roles));
      await this.redisService.cacheUserPermissions(command.userId, permissions);
    }
    await this.uow.saveChanges();
  }
}
