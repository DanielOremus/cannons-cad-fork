import { EmailConfirmationEntity } from '../entities/email-confirmation.entity';

export type CreateConfirmationInput = Pick<
  EmailConfirmationEntity,
  'email' | 'code' | 'expiresAt'
>;
