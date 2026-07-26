import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createTransport, type Transporter } from 'nodemailer';
import { AppConfigService } from '../config/config.service';
import SMTPPool from 'nodemailer/lib/smtp-pool';

@Injectable()
export class MailerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('AppCore');
  private readonly mailer: Transporter;
  constructor(private readonly config: AppConfigService) {
    const mailerConfig = this.config.mailer;
    const senderName = this.config.email.username;
    this.mailer = createTransport<SMTPPool.SentMessageInfo>(
      {
        host: mailerConfig.host,
        pool: true,
        port: mailerConfig.port,
        secure: mailerConfig.secure,
        auth: {
          user: mailerConfig.user,
          pass: mailerConfig.password,
        },
      } as SMTPPool.Options,
      {
        from: `${senderName} <${mailerConfig.user}>`,
      } as SMTPPool.Options,
    );
  }

  async sendMail(to: string, subject: string, html: string) {
    await this.mailer.sendMail({ to, subject, html });
  }

  async onModuleInit() {
    try {
      await this.mailer.verify();
      this.logger.log('Mailer verified successfully');
    } catch (error) {
      this.logger.error('Mailer failed to verify: ' + error);
    }
  }
  onModuleDestroy() {
    this.mailer.close();
  }
}
