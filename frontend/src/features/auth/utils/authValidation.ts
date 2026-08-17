import {
  type LoginErrors,
  type LoginValues,
  type RegisterErrors,
  type RegisterValues,
} from '../model/authForm.types';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string) {
  if (!email.trim()) {
    return 'Email is required.';
  }

  if (!emailPattern.test(email)) {
    return 'Enter a valid email address.';
  }

  return undefined;
}

function validatePassword(password: string) {
  if (!password) {
    return 'Password is required.';
  }

  if (password.length < 4) {
    return 'Password must contain at least 4 characters.';
  }

  return undefined;
}

export function validateLogin(values: LoginValues, captchaToken: string) {
  const errors: LoginErrors = {};
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);

  if (emailError) {
    errors.email = emailError;
  }

  if (passwordError) {
    errors.password = passwordError;
  }

  if (!captchaToken) {
    errors.captchaToken = 'Complete the Turnstile verification to continue.';
  }

  return errors;
}

export function validateRegister(values: RegisterValues, captchaToken: string) {
  const errors: RegisterErrors = {};
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);

  if (!values.name.trim()) {
    errors.name = 'Name is required.';
  }

  if (emailError) {
    errors.email = emailError;
  }

  if (passwordError) {
    errors.password = passwordError;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords must match.';
  }

  if (!values.acceptsTerms) {
    errors.acceptsTerms = 'You must accept the community terms to register.';
  }

  if (!captchaToken) {
    errors.captchaToken = 'Complete the Turnstile verification to continue.';
  }

  return errors;
}

export function hasErrors(errors: LoginErrors | RegisterErrors) {
  return Object.keys(errors).length > 0;
}
