import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EmailJobName, EmailJobPayloads } from './email.jobs';
import { EmailService } from '../email.service';
import { Job } from 'bullmq';

@Processor('email')
export class EmailConsumer extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }
  async process(
    job: Job<EmailJobPayloads[keyof EmailJobPayloads], any, EmailJobName>,
  ): Promise<any> {
    await this.emailService.send(job.name, job.data);
  }
}
