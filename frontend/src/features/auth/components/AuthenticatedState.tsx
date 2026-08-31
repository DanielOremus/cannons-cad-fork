import { type UserProfile } from '../model/auth.types';
import UserSummary from './UserSummary';
import { Link } from 'react-router-dom';

type AuthenticatedStateProps = {
  user: UserProfile;
  isAdmin: boolean;
  isLoggingOut: boolean;
  onLogout: () => void;
};

function AuthenticatedState({ user, isAdmin, isLoggingOut, onLogout }: AuthenticatedStateProps) {
  return (
    <div className="auth-form">
      <UserSummary title="Authentication successful" user={user} />
      {isAdmin && (
        <Link className="secondary-button" to="/admin">
          Open user management
        </Link>
      )}
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
