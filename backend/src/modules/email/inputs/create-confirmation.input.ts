import { EmailConfirmationEntity } from '../entities/email-confirmation.entity.js';

export type CreateConfirmationInput = Pick<EmailConfirmationEntity, 'email' | 'code' | 'expiresAt'>;
