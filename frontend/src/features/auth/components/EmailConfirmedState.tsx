import { type UserProfile } from '../model/auth.types';
import UserSummary from './UserSummary';

type EmailConfirmedStateProps = {
  user: UserProfile | null;
  onReturnToLogin: () => void;
};

function EmailConfirmedState({ user, onReturnToLogin }: EmailConfirmedStateProps) {
  return (
    <div className="auth-form">
      {user && <UserSummary title="Email confirmed" user={user} />}
      <p className="auth-message" role="status">
        {user?.status === 'PENDING'
          ? 'Your email is confirmed. Your account is waiting for administrator approval.'
          : 'Your email is confirmed. You can return to login.'}
      </p>
      <button className="primary-button" type="button" onClick={onReturnToLogin}>
        Return to login
      </button>
    </div>
  );
}

export default EmailConfirmedState;
