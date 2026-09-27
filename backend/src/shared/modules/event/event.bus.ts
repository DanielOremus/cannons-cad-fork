import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventName, EventPayload } from '../../constants/events.js';

@Injectable()
export class EventBus {
  constructor(private readonly emitter: EventEmitter2) {}
  emit<E extends EventName>(event: E, payload: EventPayload<E>): boolean {
    return this.emitter.emit(event, payload);
  }
}
