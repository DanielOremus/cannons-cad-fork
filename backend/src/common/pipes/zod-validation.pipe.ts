import { ZodError, ZodType } from 'zod/v4';
import { ValidationError } from '../../shared/errors/app.error';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly zodSchema: ZodType) {}
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.zodSchema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        //transform error
        throw new ValidationError('ssss');
      }
      throw error;
    }
  }
}
