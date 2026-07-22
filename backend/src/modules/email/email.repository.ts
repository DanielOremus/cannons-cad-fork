import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateConfirmationInput } from './inputs/create-confirmation.input';
import { EmailConfirmationEntity } from './entities/email-confirmation.entity';
import { EmailMapper } from './email.mapper';
import { EmailConfirmation } from '../../generated/prisma/client';
import { TransactionClient } from '../../generated/prisma/internal/prismaNamespace';

@Injectable()
export class EmailRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly confirmationMapper: EmailMapper,
  ) {}
  private returnMapped(raw: EmailConfirmation | null) {
    return raw ? this.confirmationMapper.toDomain(raw) : null;
  }
  async createConfirmation(
    input: CreateConfirmationInput,
    tx: TransactionClient = this.prismaService,
  ): Promise<EmailConfirmationEntity> {
    const toReturn = await tx.emailConfirmation.create({
      data: input,
    });
    return this.confirmationMapper.toDomain(toReturn);
  }
  async findByEmail(email: string): Promise<EmailConfirmationEntity | null> {
    const confirmation = await this.prismaService.emailConfirmation.findUnique({
      where: { email },
    });
    return this.returnMapped(confirmation);
  }
  async incrementAttempt(email: string): Promise<void> {
    await this.prismaService.emailConfirmation.update({
      where: { email },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });
  }
  async deleteByEmail(
    email: string,
    tx: TransactionClient = this.prismaService,
  ): Promise<void> {
    await tx.emailConfirmation.delete({ where: { email } });
  }
}
