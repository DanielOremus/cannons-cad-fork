import { Injectable } from '@nestjs/common';
import { CreateConfirmationInput } from './inputs/create-confirmation.input';
import { EmailConfirmationEntity } from './entities/email-confirmation.entity';

@Injectable()
export class EmailRepository {
  async createConfirmation(input: CreateConfirmationInput) {
    // ): Promise<EmailConfirmationEntity> {
    //   const toReturn = await tx.emailConfirmation.create({
    //     data: input,
    //   });
    //   return this.confirmationMapper.toDomain(toReturn);
  }

  async findByEmail(email: string): Promise<EmailConfirmationEntity | null> {
    // const confirmation = await this.prismaService.emailConfirmation.findUnique({
    //   where: { email },
    // });
    // return this.returnMapped(confirmation);
    return null;
  }
  async incrementAttempt(email: string): Promise<void> {
    // await this.prismaService.emailConfirmation.update({
    //   where: { email },
    //   data: {
    //     attempts: {
    //       increment: 1,
    //     },
    //   },
    // });
  }
  async deleteByEmail(email: string): Promise<void> {
    // await tx.emailConfirmation.delete({ where: { email } });
  }
}
