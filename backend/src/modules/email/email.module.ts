import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MailerModule } from '../../core/mailer/mailer.module';
import { EmailService } from './email.service';
import { EmailConsumer } from './queue/email.consumer';
import { EmailProducer } from './queue/email.producer';
import { EmailRepository } from './email.repository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EmailConfirmationEntity } from './entities/email-confirmation.entity';
import { OrmEmailRepository } from './infrastructure/orm.email.repository';

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
