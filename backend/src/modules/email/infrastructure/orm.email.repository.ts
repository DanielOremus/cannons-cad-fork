import { EmailRepository } from '../email.repository';
import { EntityManager } from '@mikro-orm/postgresql';

import { CreateConfirmationInput } from '../inputs/create-confirmation.input';
import { EmailConfirmationEntity } from '../entities/email-confirmation.entity';

export class OrmEmailRepository extends EmailRepository {
  private readonly entity = EmailConfirmationEntity;
  constructor(private readonly em: EntityManager) {
    super();
  }
  async createConfirmation(
    input: CreateConfirmationInput,
  ): Promise<EmailConfirmationEntity> {
    return this.em.create(this.entity, input);
  }

  async findByEmail(email: string): Promise<EmailConfirmationEntity | null> {
    return await this.em.findOne(this.entity, { email });
  }

  // abstract incrementAttempt(email: string): Promise<void>;
  // await this.prismaService.emailConfirmation.update({
  //   where: { email },
  //   data: {
  //     attempts: {
  //       increment: 1,
  //     },
  //   },
  // });

  async delete(entity: EmailConfirmationEntity): Promise<void> {
    this.em.remove(entity);
  }
}
