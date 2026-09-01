import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MailerModule } from '../../core/mailer/mailer.module.js';
import { EmailService } from './email.service.js';
import { EmailConsumer } from './queue/email.consumer.js';
import { EmailProducer } from './queue/email.producer.js';
import { EmailRepository } from './email.repository.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EmailConfirmationEntity } from './entities/email-confirmation.entity.js';
import { OrmEmailRepository } from './infrastructure/orm.email.repository.js';

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
    MikroOrmModule.forFeature([EmailConfirmationEntity]),
  ],
  providers: [
    EmailService,
    {
      provide: EmailRepository,
      useClass: OrmEmailRepository,
    },
    EmailConsumer,
    EmailProducer,
  ],
  exports: [EmailProducer, EmailRepository],
})
export class EmailModule {}
