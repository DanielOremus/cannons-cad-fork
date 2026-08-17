import { type Dispatch, type FormEvent, type SetStateAction } from 'react';
import {
  type LoginErrors,
  type LoginValues,
} from '../model/authForm.types';
import TurnstileWidget from './TurnstileWidget';

type LoginFormProps = {
  values: LoginValues;
  errors: LoginErrors;
  isSubmitting: boolean;
  canSubmit: boolean;
  turnstileResetSignal: number;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onValuesChange: Dispatch<SetStateAction<LoginValues>>;
  onCaptchaTokenChange: (token: string) => void;
  onCaptchaUnavailable: (error: string) => void;
};

function LoginForm({
  values,
  errors,
  isSubmitting,
  canSubmit,
  turnstileResetSignal,
  onSubmit,
  onValuesChange,
  onCaptchaTokenChange,
  onCaptchaUnavailable,
}: LoginFormProps) {
  return (
    <form
      id="login-panel"
      role="tabpanel"
      aria-labelledby="login-tab"
      className="auth-form"
      noValidate
      onSubmit={onSubmit}
    >
      {errors.form && (
        <p className="auth-error" role="alert">
          {errors.form}
        </p>
      )}

      <div className="form-field">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          onChange={(event) =>
            onValuesChange((currentValues) => ({
              ...currentValues,
              email: event.target.value,
            }))
          }
        />
        {errors.email && (
          <p className="field-error" id="login-email-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
          onChange={(event) =>
            onValuesChange((currentValues) => ({
              ...currentValues,
              password: event.target.value,
            }))
          }
        />
        {errors.password && (
          <p className="field-error" id="login-password-error" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <TurnstileWidget
          action="login"
          resetSignal={turnstileResetSignal}
          onTokenChange={onCaptchaTokenChange}
          onUnavailable={onCaptchaUnavailable}
        />
        {errors.captchaToken && (
          <p className="field-error" role="alert">
            {errors.captchaToken}
          </p>
        )}
      </div>

      <div className="form-row">
        <label className="checkbox-field" htmlFor="remember-me">
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            checked={values.rememberMe}
            onChange={(event) =>
              onValuesChange((currentValues) => ({
                ...currentValues,
                rememberMe: event.target.checked,
              }))
            }
          />
          <span>Remember me</span>
        </label>

        <button className="text-button" type="button">
          Forgot password?
        </button>
      </div>

      <button className="primary-button" type="submit" disabled={!canSubmit}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}

export default LoginForm;
