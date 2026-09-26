import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { ApiErrorResponse, ErrorCode, ValidationIssue } from '@project/shared';
import { Response } from 'express';
import { AppError, ValidationError } from '../../shared/errors/app.error.js';
import { AppSocket } from '../../shared/types/socket.js';

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

type ExceptionParseResult = {
  errorCode: ErrorCode;
  errorMessage?: string;
  errorIssues?: ValidationIssue[];
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  private parseException(exception: unknown): ExceptionParseResult {
    let errorCode: ErrorCode;
    let errorMessage;
    let errorIssues;

    if (exception instanceof AppError) {
      errorCode = exception.code;
      errorMessage = exception.message;

      if (exception instanceof ValidationError) errorIssues = exception.issues;
    } else {
      errorCode = ErrorCode.UNHANDLED_ERROR;
      errorMessage = 'Something went wrong, please try again later';
    }

    return { errorCode, errorMessage, errorIssues };
  }

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(exception);

    const { errorCode, errorIssues, errorMessage } = this.parseException(exception);

    if (host.getType() === 'ws') {
      const socket = host.switchToWs().getClient<AppSocket>();
      socket.emit('error', { errorCode, errorMessage });
      return;
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = ErrorCodeToHttpStatus[errorCode];

    response
      .status(status)
      .json({ errorCode, errorMessage, errorIssues } satisfies ApiErrorResponse);
  }
}
