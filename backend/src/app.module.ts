import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './core/core.module';
import { CharacterModule } from './modules/character/character.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CoreModule, CqrsModule.forRoot(), AuthModule, CharacterModule],
})
export class AppModule {}
