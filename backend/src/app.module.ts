import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [CqrsModule.forRoot(), CoreModule, ModulesModule],
})
export class AppModule {}
