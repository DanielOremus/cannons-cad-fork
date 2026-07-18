import { DriverCategory } from '@project/shared';
import { BaseEntity } from '../../../shared/entities/base.entity';

export class DriverLicenseEntity implements BaseEntity {
  id: number;
  categories: DriverCategory[];
}
