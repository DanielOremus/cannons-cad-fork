import { Injectable } from '@nestjs/common';
import { MailerService } from '../../core/mailer/mailer.service';
import { EmailJobName, EmailJobPayloads } from './queue/email.jobs';
import path from 'path';
import ejs from 'ejs';

@Injectable()
export class EmailService {
  constructor(private readonly mailer: MailerService) {}
  private handlers: {
    [J in EmailJobName]: (payload: EmailJobPayloads[J]) => Promise<void>;
  } = {
    confirmEmail: this.emailConfirmation.bind(this),
    changeEmail: async (payload) => {},
  };
  private templates: Record<EmailJobName, string> = {
    confirmEmail: path.join(__dirname, 'templates', 'confirm-email.template.ejs'),
    changeEmail: '',
  };
  private async renderTemplate<J extends EmailJobName>(task: J, data: EmailJobPayloads[J]) {
    return await ejs.renderFile(this.templates[task], data);
  }
  private async emailConfirmation(payload: EmailJobPayloads['confirmEmail']) {
    const html = await this.renderTemplate('confirmEmail', payload);
    await this.mailer.sendMail(payload.target, 'Confirm your email', html);
  }
  async send<J extends EmailJobName>(task: J, payload: EmailJobPayloads[J]) {
    await this.handlers[task](payload);
  }
}
