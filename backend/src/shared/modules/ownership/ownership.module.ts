import { Module } from '@nestjs/common';
import { OwnershipService } from './ownership.service.js';

@Module({
  providers: [OwnershipService],
  exports: [OwnershipService],
})
export class OwnershipModule {}
