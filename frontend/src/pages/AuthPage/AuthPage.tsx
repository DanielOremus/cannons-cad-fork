import { type FormEvent, useCallback, useEffect, useState } from 'react';
import {
  confirmEmail,
  login,
  logout,
  refreshSession,
  resendConfirmationCode,
  register,
} from '../../features/auth/api/authApi';
import AuthenticatedState from '../../features/auth/components/AuthenticatedState';
import AuthTabs from '../../features/auth/components/AuthTabs';
import EmailConfirmationForm from '../../features/auth/components/EmailConfirmationForm';
import EmailConfirmedState from '../../features/auth/components/EmailConfirmedState';
import LoginForm from '../../features/auth/components/LoginForm';
import RegisterForm from '../../features/auth/components/RegisterForm';
import { type UserProfile } from '../../features/auth/model/auth.types';
import {
  type AuthMode,
  type AuthStep,
  type LoginErrors,
  type RegisterErrors,
  initialLoginValues,
  initialRegisterValues,
} from '../../features/auth/model/authForm.types';
import {
  getErrorMessage,
  getLoginErrorMessage,
  getRegisterFieldErrors,
} from '../../features/auth/utils/authErrors';
import {
  hasErrors,
  validateLogin,
  validateRegister,
} from '../../features/auth/utils/authValidation';
import './AuthPage.css';

const RESEND_COOLDOWN_SECONDS = 45;

function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [step, setStep] = useState<AuthStep>('forms');
  const [loginValues, setLoginValues] = useState(initialLoginValues);
  const [registerValues, setRegisterValues] = useState(initialRegisterValues);
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({});
  const [confirmationCode, setConfirmationCode] = useState('');
  const [confirmationError, setConfirmationError] = useState('');
  const [message, setMessage] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [loginCaptchaToken, setLoginCaptchaToken] = useState('');
  const [registerCaptchaToken, setRegisterCaptchaToken] = useState('');
  const [loginTurnstileReset, setLoginTurnstileReset] = useState(0);
  const [registerTurnstileReset, setRegisterTurnstileReset] = useState(0);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  const [isSubmittingConfirmation, setIsSubmittingConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  const loginUnavailable = useCallback((turnstileError: string) => {
    setLoginErrors((errors) => ({ ...errors, captchaToken: turnstileError }));
  }, []);

  const registerUnavailable = useCallback((turnstileError: string) => {
    setRegisterErrors((errors) => ({ ...errors, captchaToken: turnstileError }));
  }, []);

  useEffect(() => {
    if (resendSeconds <= 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [resendSeconds]);

  function resetLoginTurnstile() {
    setLoginCaptchaToken('');
    setLoginTurnstileReset((value) => value + 1);
  }

  function resetRegisterTurnstile() {
    setRegisterCaptchaToken('');
    setRegisterTurnstileReset((value) => value + 1);
  }

  function clearConfirmationState() {
    setRegisteredEmail('');
    setConfirmationCode('');
    setConfirmationError('');
    setResendMessage(null);
    setResendError(null);
    setResendSeconds(0);
    setIsResending(false);
  }

  function clearAuthState() {
    setAccessToken('');
    setUser(null);
    clearConfirmationState();
  }

  function returnToLogin(nextMessage = '') {
    clearAuthState();
    setMode('login');
    setStep('forms');
    setMessage(nextMessage);
    setLoginErrors({});
    setRegisterErrors({});
    resetLoginTurnstile();
    resetRegisterTurnstile();
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage('');
    setLoginErrors({});
    setRegisterErrors({});
    clearAuthState();
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateLogin(loginValues, loginCaptchaToken);
    setLoginErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      setMessage('');
      return;
    }

    setIsSubmittingLogin(true);
    setMessage('');

    try {
      const response = await login({
        email: loginValues.email.trim(),
        password: loginValues.password,
        captchaToken: loginCaptchaToken,
      });

      clearConfirmationState();
      setAccessToken(response.access);
      setUser(response.user);
      setRegisteredEmail(response.user.email ?? loginValues.email.trim());
      setStep(response.user.emailConfirmed === false ? 'confirm-email' : 'authenticated');
      setMessage('');
      setLoginErrors({});
    } catch (error) {
      setLoginErrors({ form: getLoginErrorMessage(error) });
    } finally {
      setIsSubmittingLogin(false);
      resetLoginTurnstile();
    }
  }

  async function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateRegister(registerValues, registerCaptchaToken);
    setRegisterErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      setMessage('');
      return;
    }

    setIsSubmittingRegister(true);
    setMessage('');

    try {
      const response = await register({
        name: registerValues.name.trim(),
        email: registerValues.email.trim(),
        password: registerValues.password,
        confirmPassword: registerValues.confirmPassword,
        captchaToken: registerCaptchaToken,
      });

      clearConfirmationState();
      setAccessToken(response.access);
      setUser(response.user);
      setRegisteredEmail(registerValues.email.trim());
      setStep('confirm-email');
      setRegisterErrors({});
    } catch (error) {
      const fieldErrors = getRegisterFieldErrors(error);
      setRegisterErrors({
        ...fieldErrors,
        form:
          Object.keys(fieldErrors).length > 0
            ? undefined
            : getErrorMessage(error, 'Unable to create account. Please try again.'),
      });
    } finally {
      setIsSubmittingRegister(false);
      resetRegisterTurnstile();
    }
  }

  async function handleConfirmationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!confirmationCode.trim()) {
      setConfirmationError('Confirmation code is required.');
      return;
    }

    if (!/^\d{6}$/.test(confirmationCode)) {
      setConfirmationError('Enter the six-digit confirmation code.');
      return;
    }

    if (!accessToken) {
      setConfirmationError('Your registration session expired. Return to login and try again.');
      return;
    }

    setIsSubmittingConfirmation(true);
    setConfirmationError('');
    setResendError(null);

    try {
      await confirmEmail({ code: confirmationCode }, accessToken);

      try {
        const refreshed = await refreshSession();
        setAccessToken(refreshed.access);
      } catch {
        // Keep the current in-memory token if refresh is not available for this account state.
      }

      setUser((currentUser) =>
        currentUser ? { ...currentUser, emailConfirmed: true } : currentUser,
      );
      setStep('email-confirmed');
    } catch (error) {
      setConfirmationError(
        getErrorMessage(error, 'Unable to confirm email. Please check the code.'),
      );
    } finally {
      setIsSubmittingConfirmation(false);
    }
  }

  async function handleResendCode() {
    if (!accessToken) {
      setResendMessage(null);
      setResendError('Your session expired. Sign in again to request a new code.');
      return;
    }

    if (isResending || resendSeconds > 0) {
      return;
    }

    setIsResending(true);
    setResendMessage(null);
    setResendError(null);

    try {
      await resendConfirmationCode(accessToken);
      setResendMessage('A new confirmation code has been sent. Open Mailpit to view it.');
      setResendSeconds(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setResendError(
        getErrorMessage(error, 'The confirmation code could not be sent. Please try again.'),
      );
    } finally {
      setIsResending(false);
    }
  }

  async function handleLogout() {
    if (!accessToken) {
      returnToLogin();
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout(accessToken);
      returnToLogin();
    } catch {
      returnToLogin(
        'Frontend session cleared. The backend logout endpoint may require a confirmed account.',
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-heading">
        <div className="auth-header">
          <p className="auth-eyebrow">Cannons CAD</p>
          <h1 id="auth-heading">{step === 'authenticated' ? 'Signed in' : 'Welcome back'}</h1>
          <p>Sign in to access your role-play community dashboard.</p>
        </div>

        {message && (
          <p className="auth-message" role="status">
            {message}
          </p>
        )}

        {step === 'forms' && (
          <>
            <AuthTabs mode={mode} onChange={changeMode} />
            {mode === 'login' ? (
              <LoginForm
                values={loginValues}
                errors={loginErrors}
                isSubmitting={isSubmittingLogin}
                canSubmit={!isSubmittingLogin && Boolean(loginCaptchaToken)}
                turnstileResetSignal={loginTurnstileReset}
                onSubmit={(event) => {
                  void handleLoginSubmit(event);
                }}
                onValuesChange={setLoginValues}
                onCaptchaTokenChange={setLoginCaptchaToken}
                onCaptchaUnavailable={loginUnavailable}
              />
            ) : (
              <RegisterForm
                values={registerValues}
                errors={registerErrors}
                isSubmitting={isSubmittingRegister}
                canSubmit={!isSubmittingRegister && Boolean(registerCaptchaToken)}
                turnstileResetSignal={registerTurnstileReset}
                onSubmit={(event) => {
                  void handleRegisterSubmit(event);
                }}
                onValuesChange={setRegisterValues}
                onCaptchaTokenChange={setRegisterCaptchaToken}
                onCaptchaUnavailable={registerUnavailable}
              />
            )}
          </>
        )}

        {step === 'confirm-email' && (
          <EmailConfirmationForm
            code={confirmationCode}
            email={registeredEmail}
            error={confirmationError}
            isSubmitting={isSubmittingConfirmation}
            isResending={isResending}
            resendSeconds={resendSeconds}
            resendMessage={resendMessage}
            resendError={resendError}
            onCodeChange={setConfirmationCode}
            onSubmit={(event) => {
              void handleConfirmationSubmit(event);
            }}
            onResendCode={() => void handleResendCode()}
            onReturnToLogin={() => returnToLogin()}
          />
        )}

        {step === 'email-confirmed' && (
          <EmailConfirmedState user={user} onReturnToLogin={() => returnToLogin()} />
        )}

        {step === 'authenticated' && user && (
          <AuthenticatedState
            user={user}
            isLoggingOut={isLoggingOut}
            onLogout={() => void handleLogout()}
          />
        )}
      </section>
    </main>
  );
}

export default AuthPage;
