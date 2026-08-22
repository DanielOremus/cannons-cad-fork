import { type UserProfile } from '../model/auth.types';
import UserSummary from './UserSummary';

type AuthenticatedStateProps = {
  user: UserProfile;
  isLoggingOut: boolean;
  onLogout: () => void;
};

function AuthenticatedState({ user, isLoggingOut, onLogout }: AuthenticatedStateProps) {
  return (
    <div className="auth-form">
      <UserSummary title="Authentication successful" user={user} />
      <button
        className="primary-button"
        type="button"
        disabled={isLoggingOut}
        onClick={onLogout}
      >
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}

export default AuthenticatedState;
