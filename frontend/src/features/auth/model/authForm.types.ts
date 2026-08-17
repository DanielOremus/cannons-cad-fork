export type AuthMode = 'login' | 'register';
export type AuthStep = 'forms' | 'confirm-email' | 'authenticated' | 'email-confirmed';

export type LoginValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptsTerms: boolean;
};

export type LoginErrors = Partial<Record<keyof LoginValues | 'captchaToken' | 'form', string>>;
export type RegisterErrors = Partial<Record<keyof RegisterValues | 'captchaToken' | 'form', string>>;

export const initialLoginValues: LoginValues = {
  email: '',
  password: '',
  rememberMe: false,
};

export const initialRegisterValues: RegisterValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptsTerms: false,
};
