import { SetMetadata } from '@nestjs/common';

export const SET_REFRESH_COOKIE_KEY = 'setRefreshCookie';
export const SetRefreshCookie = () => SetMetadata(SET_REFRESH_COOKIE_KEY, true);

export const CLEAR_REFRESH_COOKIE_KEY = 'clearRefreshCookie';
export const ClearRefreshCookie = () => SetMetadata(CLEAR_REFRESH_COOKIE_KEY, true);
