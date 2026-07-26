import { publicUserResponseSchema, privateUserResponseSchema } from '@project/shared';
import { createZodDto } from 'nestjs-zod';

export class PublicUserResponseDto extends createZodDto(publicUserResponseSchema) {}

export class PrivateUserResponseDto extends createZodDto(privateUserResponseSchema) {}
