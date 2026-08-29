import * as z from 'zod/v4';
import { getUsersQuerySchema } from '../../validators/user.schema.js';

export type GetUsersQueryDto = z.infer<typeof getUsersQuerySchema>;
