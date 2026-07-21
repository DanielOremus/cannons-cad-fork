import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createTransport, type Transporter } from 'nodemailer';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class MailerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('AppCore');
  private readonly mailer: Transporter;
  constructor(private readonly config: AppConfigService) {
    const mailerConfig = this.config.mailer;
    this.mailer = createTransport({
      host: mailerConfig.host,
      port: mailerConfig.port,
      pool: true,
      secure: mailerConfig.secure,
      auth: {
        user: mailerConfig.user,
        pass: mailerConfig.password,
      },
    });
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
