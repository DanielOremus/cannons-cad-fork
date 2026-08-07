import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './core/core.module';
import { CharacterModule } from './modules/character/character.module';

@Module({
  imports: [CoreModule, AuthModule, CharacterModule],
})
export class AppModule {}
