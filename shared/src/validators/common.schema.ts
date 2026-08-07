import * as z from 'zod/v4';

export const uuidValidator = z.uuidv4();
export const idValidator = z.int().positive();
