import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { EmailJobName, EmailJobPayloads } from './email.jobs';

Injectable();
export class EmailProducer {
  constructor(@InjectQueue('email') private readonly queue: Queue) {}
  async add<J extends EmailJobName>(jobName: J, payload: EmailJobPayloads[J]) {
    await this.queue.add(jobName, payload);
  }
}
