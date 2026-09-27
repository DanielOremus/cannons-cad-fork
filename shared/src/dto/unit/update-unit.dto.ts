import * as z from 'zod/v4';
import { updateUnitSchema } from '../../validators/unit.schema.js';
import type { UnitDto } from './get-unit.dto.js';

export type UpdateUnitDto = z.infer<typeof updateUnitSchema>;

export type UpdateUnitResponseDto = Pick<UnitDto, 'id' | 'callsign' | 'status'>;
