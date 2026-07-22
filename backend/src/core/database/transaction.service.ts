import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TransactionClient } from '../../generated/prisma/internal/prismaNamespace';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}
  async execute<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> {
    return this.prismaService.$transaction(fn);
  }
}
