import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { ErrorCode, ValidationIssue } from '@project/shared';
import { Request, Response } from 'express';
import { AppError, ValidationError } from '../../shared/errors/app.error.js';

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
    // const request = ctx.getRequest<Request>();

    let errorCode: ErrorCode;
    let errorMessage: string;
    let errorIssues: ValidationIssue[] | undefined;

    if (exception instanceof AppError) {
      errorCode = exception.code;
      errorMessage = exception.message;
      if (exception instanceof ValidationError) {
        errorIssues = exception.issues;
      }
    } else {
      errorCode = ErrorCode.UNHANDLED_ERROR;
      errorMessage = 'Something went wrong, please try again later';
    }
    const status = ErrorCodeToHttpStatus[errorCode];

    this.logger.error(exception);

    response.status(status).json({
      errorCode,
      errorMessage,
      errorIssues,
    });
  }
}
