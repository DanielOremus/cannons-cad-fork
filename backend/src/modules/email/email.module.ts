import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MailerModule } from '../../core/mailer/mailer.module';
import { EmailService } from './email.service';
import { EmailConsumer } from './email.consumer';
import { EmailProducer } from './email.producer';

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
  ],
  providers: [EmailService, EmailConsumer, EmailProducer],
  exports: [EmailProducer],
})
export class EmailModule {}
