import { Injectable } from '@nestjs/common';
import { AppError, NotFoundError } from '../../shared/errors/app.error.js';
import { EmailRepository } from '../email/email.repository.js';
import { UnitOfWork } from '../../core/database/unit-of-work.js';
import { ErrorCode } from '@project/shared';
import { UserEntity } from '../user/entities/user.entity.js';
import { EmailProducer } from '../email/queue/email.producer.js';
import { AppConfigService } from '../../core/config/config.service.js';
import { randomInt } from 'crypto';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly emailRepository: EmailRepository,
    private readonly emailProducer: EmailProducer,
    private readonly config: AppConfigService,
    private readonly uow: UnitOfWork,
  ) {}
  async create(user: UserEntity) {
    const emailCode = randomInt(100000, 999999).toString();
    const confirmation = await this.emailRepository.createConfirmation({
      code: emailCode,
      email: user.email,
      expiresAt: new Date(Date.now() + this.config.email.confirmationTtl * 1000),
    });
    await this.emailProducer.add('confirmEmail', {
      code: emailCode,
      target: user.email,
      userName: user.name,
      ttl: this.config.email.confirmationTtl,
    });
    return confirmation;
  }
  async confirm(user: UserEntity, code: string) {
    const confirmation = await this.emailRepository.findByEmail(user.email);
    if (!confirmation) throw new NotFoundError('Confirmation');

    if (confirmation.expiresAt.getTime() <= new Date().getTime()) {
      await this.emailRepository.delete(confirmation);
      //must be outside the transaction, we don't want to revert the confirmation removal
      await this.uow.saveChanges();
      throw new AppError('Code expired', ErrorCode.CODE_EXPIRED);
    }
    if (confirmation.code !== code) {
      if (confirmation.attempts >= 2) {
        await this.emailRepository.delete(confirmation);
        //must be outside the transaction, we don't want to revert the confirmation removal
        await this.uow.saveChanges();
        throw new AppError('Out of attempts', ErrorCode.TOO_MANY_ATTEMPTS);
      }
      confirmation.incrementAttempt();
      await this.uow.saveChanges();
      //must be outside the transaction, we don't want to revert confirmation removal
      // throw new ValidationError([], "Code does not match")
      throw new AppError('Code does not match', ErrorCode.VALIDATION_FAILED);
    }
    await this.uow.withTransaction(async () => {
      await this.emailRepository.delete(confirmation);
      user.emailConfirmed = true;
    });
  }
  async resend(user: UserEntity) {
    const confirmation = await this.emailRepository.findByEmail(user.email);
    if (confirmation) {
      await this.emailRepository.delete(confirmation);
    }
    await this.create(user);
    await this.uow.saveChanges();
  }
}
