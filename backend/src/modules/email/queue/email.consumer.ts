import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { EmailJobNames, EmailJobPayloads } from './email.jobs.js';
import { EmailService } from '../email.service.js';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('email')
export class EmailConsumer extends WorkerHost {
  private readonly logger = new Logger('EmailConsumer');
  constructor(private readonly emailService: EmailService) {
    super();
  }
  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.debug(`Job ${job.name} failed: ${err}`);
  }
  async process<T extends EmailJobNames>(job: Job<EmailJobPayloads[T], any, T>): Promise<any> {
    await this.emailService.send(job.name, job.data);
  }
}
