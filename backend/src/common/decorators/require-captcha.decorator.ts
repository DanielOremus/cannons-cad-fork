import { SetMetadata } from '@nestjs/common';

export const CAPTCHA_KEY = 'captcha';

export const SetCaptchaField = (fieldName: string) => SetMetadata(CAPTCHA_KEY, fieldName);
