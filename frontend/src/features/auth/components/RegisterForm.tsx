import { type Dispatch, type FormEvent, type SetStateAction } from 'react';
import {
  type RegisterErrors,
  type RegisterValues,
} from '../model/authForm.types';
import TurnstileWidget from './TurnstileWidget';

type RegisterFormProps = {
  values: RegisterValues;
  errors: RegisterErrors;
  isSubmitting: boolean;
  canSubmit: boolean;
  turnstileResetSignal: number;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onValuesChange: Dispatch<SetStateAction<RegisterValues>>;
  onCaptchaTokenChange: (token: string) => void;
  onCaptchaUnavailable: (error: string) => void;
};

function RegisterForm({
  values,
  errors,
  isSubmitting,
  canSubmit,
  turnstileResetSignal,
  onSubmit,
  onValuesChange,
  onCaptchaTokenChange,
  onCaptchaUnavailable,
}: RegisterFormProps) {
  return (
    <form
      id="register-panel"
      role="tabpanel"
      aria-labelledby="register-tab"
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
        <label htmlFor="register-name">Name</label>
        <input
          id="register-name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'register-name-error' : undefined}
          onChange={(event) =>
            onValuesChange((currentValues) => ({
              ...currentValues,
              name: event.target.value,
            }))
          }
        />
        {errors.name && (
          <p className="field-error" id="register-name-error" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'register-email-error' : undefined}
          onChange={(event) =>
            onValuesChange((currentValues) => ({
              ...currentValues,
              email: event.target.value,
            }))
          }
        />
        {errors.email && (
          <p className="field-error" id="register-email-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'register-password-error' : undefined}
          onChange={(event) =>
            onValuesChange((currentValues) => ({
              ...currentValues,
              password: event.target.value,
            }))
          }
        />
        {errors.password && (
          <p className="field-error" id="register-password-error" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="register-confirm-password">Confirm password</label>
        <input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={
            errors.confirmPassword ? 'register-confirm-password-error' : undefined
          }
          onChange={(event) =>
            onValuesChange((currentValues) => ({
              ...currentValues,
              confirmPassword: event.target.value,
            }))
          }
        />
        {errors.confirmPassword && (
          <p className="field-error" id="register-confirm-password-error" role="alert">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <div className="captcha">
        <TurnstileWidget
          action="register"
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

      <div className="form-field">
        <label className="checkbox-field" htmlFor="accepts-terms">
          <input
            id="accepts-terms"
            name="acceptsTerms"
            type="checkbox"
            checked={values.acceptsTerms}
            aria-invalid={Boolean(errors.acceptsTerms)}
            aria-describedby={errors.acceptsTerms ? 'accepts-terms-error' : undefined}
            onChange={(event) =>
              onValuesChange((currentValues) => ({
                ...currentValues,
                acceptsTerms: event.target.checked,
              }))
            }
          />
          <span>
            I accept the <a>community terms.</a>
          </span>
        </label>
        {errors.acceptsTerms && (
          <p className="field-error" id="accepts-terms-error" role="alert">
            {errors.acceptsTerms}
          </p>
        )}
      </div>

      <button className="primary-button" type="submit" disabled={!canSubmit}>
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}

export default RegisterForm;
