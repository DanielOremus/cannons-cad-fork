import { type KeyboardEvent } from 'react';
import { type AuthMode } from '../model/authForm.types';

type AuthTabsProps = {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
};

function AuthTabs({ mode, onChange }: AuthTabsProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      onChange(mode === 'login' ? 'register' : 'login');
    }
  }

  return (
    <div className="auth-tabs" role="tablist" aria-label="Authentication form">
      <button
        type="button"
        id="login-tab"
        role="tab"
        aria-controls="login-panel"
        aria-selected={mode === 'login'}
        className="auth-tab"
        onClick={() => onChange('login')}
        onKeyDown={handleKeyDown}
      >
        Login
      </button>
      <button
        type="button"
        id="register-tab"
        role="tab"
        aria-controls="register-panel"
        aria-selected={mode === 'register'}
        className="auth-tab"
        onClick={() => onChange('register')}
        onKeyDown={handleKeyDown}
      >
        Register
      </button>
    </div>
  );
}

export default AuthTabs;
