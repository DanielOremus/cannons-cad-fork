import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MailerModule } from '../../core/mailer/mailer.module';
import { EmailService } from './email.service';
import { EmailConsumer } from './email.consumer';
import { EmailProducer } from './email.producer';
import { EmailRepository } from './email.repository';
import { EmailMapper } from './email.mapper';
import { PrismaModule } from '../../core/database/prisma.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }),
    MailerModule,
    PrismaModule,
  ],
  providers: [
    EmailMapper,
    EmailService,
    EmailRepository,
    EmailConsumer,
    EmailProducer,
  ],
  exports: [EmailProducer, EmailRepository],
})
export class EmailModule {}
