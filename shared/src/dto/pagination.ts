import { paginationSchema } from "../validators/pagination.schema.js"
import * as z from "zod/v4"

export type PaginationRequest = z.input<typeof paginationSchema>
export type PaginationDto = z.infer<typeof paginationSchema>
