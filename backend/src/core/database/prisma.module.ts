import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TransactionService } from './transaction.service';

@Module({
  providers: [PrismaService, TransactionService],
  exports: [PrismaService, TransactionService],
})
export class PrismaModule {}
