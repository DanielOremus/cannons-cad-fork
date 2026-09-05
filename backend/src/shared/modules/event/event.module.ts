import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventBus } from './event.bus.js';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [EventBus],
  exports: [EventBus],
})
export class EventModule {}
