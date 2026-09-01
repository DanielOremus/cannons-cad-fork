import { Injectable } from '@nestjs/common';
import { MailerService } from '../../core/mailer/mailer.service.js';
import { EmailJobPayloads, EmailTemplatePayloads, EmailJobNames } from './queue/email.jobs.js';
import { formatTtl } from './email.utils.js';
import ejs from 'ejs';
import path from 'path';

@Injectable()
export class EmailService {
  constructor(private readonly mailer: MailerService) {}
  private transformers: {
    [K in EmailJobNames]: (input: EmailJobPayloads[K]) => EmailTemplatePayloads[K];
  } = {
    confirmEmail: (input) => ({
      code: input.code,
      target: input.target,
      userName: input.userName,
      ttlText: formatTtl(input.ttl),
    }),
    changeEmail: (input) => ({}),
  };
  private handlers: {
    [J in EmailJobNames]: (payload: EmailTemplatePayloads[J]) => Promise<void>;
  } = {
    confirmEmail: this.sendConfirmation.bind(this),
    changeEmail: async (payload) => {},
  };
  private templates: Record<EmailJobNames, string> = {
    confirmEmail: path.join(import.meta.dirname, 'templates', 'confirm-email.template.ejs'),
    changeEmail: '',
  };
  private async renderTemplate<T extends EmailJobNames>(
    template: T,
    data: EmailTemplatePayloads[T],
  ) {
    return await ejs.renderFile(this.templates[template], data);
  }
  private async sendConfirmation(payload: EmailTemplatePayloads['confirmEmail']) {
    const html = await this.renderTemplate('confirmEmail', payload);
    await this.mailer.sendMail(payload.target, 'Confirm your email', html);
  }
  private transformPayload<T extends EmailJobNames>(
    target: T,
    input: EmailJobPayloads[T],
  ): EmailTemplatePayloads[T] {
    return this.transformers[target](input);
  }
  async send<J extends EmailJobNames>(task: J, payload: EmailJobPayloads[J]) {
    const templatePayload = this.transformPayload(task, payload);
    await this.handlers[task](templatePayload);
  }
}
