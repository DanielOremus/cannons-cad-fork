import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { EmailJobNames, EmailJobPayloads } from './email.jobs.js';

@Injectable()
export class EmailProducer {
  constructor(@InjectQueue('email') private readonly queue: Queue) {}
  async add<J extends EmailJobNames>(jobName: J, payload: EmailJobPayloads[J]) {
    await this.queue.add(jobName, payload);
  }
}
