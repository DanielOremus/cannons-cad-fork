import type { DriverCategory } from '../../types/driver.category.js';

export type DriverLicenseDto = {
  id: number;
  categories: DriverCategory[];
};
