export class EmailConfirmationEntity {
  email: string;
  code: string;
  attempts: number;
  createdAt: Date;
  expiresAt: Date;
}
