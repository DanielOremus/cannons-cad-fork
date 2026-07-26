import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { ErrorCode } from '@project/shared';
import { Request, Response } from 'express';
import { AppError } from '../../shared/errors/app.error';

const ErrorCodeToHttpStatus: Record<ErrorCode, HttpStatus> = {
  ALREADY_EXISTS: HttpStatus.CONFLICT,
  FORBIDDEN: HttpStatus.FORBIDDEN,
  NOT_FOUND: HttpStatus.NOT_FOUND,
  UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
  VALIDATION_FAILED: HttpStatus.BAD_REQUEST,
  CODE_EXPIRED: HttpStatus.BAD_REQUEST,
  TOO_MANY_ATTEMPTS: HttpStatus.TOO_MANY_REQUESTS,
  UNHANDLED_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
  ALREADY_CONFIRMED: HttpStatus.CONFLICT,
  CONFLICT: HttpStatus.CONFLICT,
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let errorCode: ErrorCode;
    let status: number;
    let errorMsg: string;
    if (exception instanceof AppError) {
      errorCode = exception.code;
      errorMsg = exception.message;
    } else {
      errorCode = ErrorCode.UNHANDLED_ERROR;
      errorMsg = 'Something went wrong, please try again later';
    }
    status = ErrorCodeToHttpStatus[errorCode];

    this.logger.error(exception);

    response.status(status).json({
      errorCode,
      errorMsg,
    });
  }
}
