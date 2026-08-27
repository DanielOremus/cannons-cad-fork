import { Injectable } from '@nestjs/common';
import { EmailRepository } from '../email.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { CreateConfirmationInput } from '../inputs/create-confirmation.input';
import { EmailConfirmationEntity } from '../entities/email-confirmation.entity';

@Injectable()
export class OrmEmailRepository extends EmailRepository {
  private readonly entity = EmailConfirmationEntity;
  constructor(private readonly em: EntityManager) {
    super();
  }
  async createConfirmation(input: CreateConfirmationInput): Promise<EmailConfirmationEntity> {
    return await this.em.create(this.entity, input);
  }

  async findByEmail(email: string): Promise<EmailConfirmationEntity | null> {
    return await this.em.findOne(this.entity, { email });
  }

  async delete(entity: EmailConfirmationEntity): Promise<void> {
    await this.em.remove(entity);
  }
}
