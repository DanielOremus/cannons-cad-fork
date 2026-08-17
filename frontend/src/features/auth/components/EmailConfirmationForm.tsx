import { type FormEvent } from 'react';

type EmailConfirmationFormProps = {
  code: string;
  email: string;
  error: string;
  isSubmitting: boolean;
  isResending: boolean;
  resendSeconds: number;
  resendMessage: string | null;
  resendError: string | null;
  onCodeChange: (code: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onResendCode: () => void;
  onReturnToLogin: () => void;
};

function EmailConfirmationForm({
  code,
  email,
  error,
  isSubmitting,
  isResending,
  resendSeconds,
  resendMessage,
  resendError,
  onCodeChange,
  onSubmit,
  onResendCode,
  onReturnToLogin,
}: EmailConfirmationFormProps) {
  return (
    <form className="auth-form" noValidate onSubmit={onSubmit}>
      <div className="auth-state">
        <h2>Confirm your email</h2>
        <p>
          Your credentials were accepted, but your email address still needs confirmation. Enter the
          six-digit code sent to {email}.
        </p>
      </div>

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-field">
        <label htmlFor="confirmation-code">Confirmation code</label>
        <input
          id="confirmation-code"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'confirmation-code-error' : undefined}
          onChange={(event) => onCodeChange(event.target.value.replace(/\D/g, '').slice(0, 6))}
        />
        {error && (
          <p className="field-error" id="confirmation-code-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="resend-code">
        {resendMessage && (
          <p className="auth-message" aria-live="polite">
            {resendMessage}
          </p>
        )}
        {resendError && (
          <p className="auth-error" role="alert">
            {resendError}
          </p>
        )}
        {resendSeconds > 0 && !resendError && (
          <p className="resend-cooldown" aria-live="polite">
            Resend available in {resendSeconds}s
          </p>
        )}
        <button
          className="secondary-button"
          type="button"
          disabled={isResending || resendSeconds > 0}
          onClick={onResendCode}
        >
          {isResending
            ? 'Sending...'
            : resendSeconds > 0
              ? `Resend available in ${resendSeconds}s`
              : 'Resend code'}
        </button>
      </div>

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Confirming...' : 'Confirm email'}
      </button>
      <button className="secondary-button" type="button" onClick={onReturnToLogin}>
        Return to login
      </button>
    </form>
  );
}

export default EmailConfirmationForm;
