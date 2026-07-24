import { Injectable } from '@nestjs/common';
import { CreateConfirmationInput } from './inputs/create-confirmation.input';
import { EmailConfirmationEntity } from './entities/email-confirmation.entity';

@Injectable()
export abstract class EmailRepository {
  abstract createConfirmation(
    input: CreateConfirmationInput,
  ): Promise<EmailConfirmationEntity>;
  // ): Promise<EmailConfirmationEntity> {
  //   const toReturn = await tx.emailConfirmation.create({
  //     data: input,
  //   });
  //   return this.confirmationMapper.toDomain(toReturn);

  abstract findByEmail(email: string): Promise<EmailConfirmationEntity | null>;
  // const confirmation = await this.prismaService.emailConfirmation.findUnique({
  //   where: { email },
  // });
  // return this.returnMapped(confirmation);

  // abstract incrementAttempt(email: string): Promise<void>;
  // await this.prismaService.emailConfirmation.update({
  //   where: { email },
  //   data: {
  //     attempts: {
  //       increment: 1,
  //     },
  //   },
  // });

  abstract delete(entity: EmailConfirmationEntity): Promise<void>;
}
