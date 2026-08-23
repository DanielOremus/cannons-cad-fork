import { Module } from '@nestjs/common';
import { OwnershipService } from './ownership.service';

@Module({
  providers: [OwnershipService],
  exports: [OwnershipService],
})
export class OwnershipModule {}
