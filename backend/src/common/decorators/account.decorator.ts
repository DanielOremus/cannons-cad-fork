import { SetMetadata } from '@nestjs/common';

export const ACTIVE_CHECK_KEY = 'skipActiveCheck';
export const EMAIL_CONFIRM_KEY = 'requireEmailOnly';

export const SkipActiveCheck = () => SetMetadata(ACTIVE_CHECK_KEY, true);
export const RequireConfirmedEmailOnly = () => SetMetadata(EMAIL_CONFIRM_KEY, true);
