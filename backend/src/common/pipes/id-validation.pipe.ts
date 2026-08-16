import * as z from 'zod/v4';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ValidationError } from '../../shared/errors/app.error';
import { idValidator, uuidValidator } from '@project/shared';

function createParamValidationPipe(schema: z.ZodType) {
  return class ParamValidationPipe implements PipeTransform {
    transform(value: unknown, metadata: ArgumentMetadata) {
      const result = schema.safeParse(value);
      if (!result.success)
        throw new ValidationError([
          { code: 'invalid_format', field: metadata.data ?? '', params: {} },
        ]);
      return result.data;
    }
  };
}

export const IdParamPipe = createParamValidationPipe(idValidator);
export const UuidParamPipe = createParamValidationPipe(uuidValidator);
