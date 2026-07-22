import { Injectable } from '@nestjs/common';
import { EmailConfirmationEntity } from './entities/email-confirmation.entity';
import { EmailConfirmation } from '../../generated/prisma/client';

@Injectable()
export class EmailMapper {
  toDomain(prismaConfirmation: EmailConfirmation): EmailConfirmationEntity {
    return { ...prismaConfirmation };
  }
}
