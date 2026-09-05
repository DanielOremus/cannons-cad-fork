import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventName, EventPayload } from '../../types/event.js';

@Injectable()
export class EventBus extends EventEmitter2 {
  emit<E extends EventName>(event: E, payload: EventPayload<E>): boolean {
    return super.emit(event, payload);
  }
}
