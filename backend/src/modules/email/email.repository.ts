import { Injectable } from '@nestjs/common';
import { CreateConfirmationInput } from './inputs/create-confirmation.input';
import { EmailConfirmationEntity } from './entities/email-confirmation.entity';

@Injectable()
export abstract class EmailRepository {
  abstract createConfirmation(input: CreateConfirmationInput): Promise<EmailConfirmationEntity>;

  abstract findByEmail(email: string): Promise<EmailConfirmationEntity | null>;
  abstract delete(entity: EmailConfirmationEntity): Promise<void>;
}
