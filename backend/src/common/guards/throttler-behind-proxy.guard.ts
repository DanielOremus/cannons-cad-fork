import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AppError } from '../../shared/errors/app.error';
import { ErrorCode } from '@project/shared';
import { Request } from 'express';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    return await Promise.resolve(req.ips.length ? req.ips[0] : (req.ip ?? '127.0.0.1'));
  }
  protected throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    throw new AppError('Too Many Requests', ErrorCode.TOO_MANY_ATTEMPTS);
  }
}
