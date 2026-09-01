import { type UserProfile } from '../model/auth.types';
import { StatusBadge } from '@/shared/components/StatusBadge';

type UserSummaryProps = {
  title: string;
  user: UserProfile;
};

function formatRoles(user: UserProfile) {
  return user.roles.length > 0 ? user.roles.join(', ') : 'None';
}

function UserSummary({ title, user }: UserSummaryProps) {
  return (
    <div className="auth-state">
      <h2>{title}</h2>
      <dl className="user-summary">
        <div>
          <dt>Name</dt>
          <dd>{user.name}</dd>
        </div>
        <div>
          <dt>Roles</dt>
          <dd>{formatRoles(user)}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <StatusBadge status={user.status} />
          </dd>
        </div>
        {typeof user.emailConfirmed === 'boolean' && (
          <div>
            <dt>Email</dt>
            <dd>{user.emailConfirmed ? 'Confirmed' : 'Not confirmed'}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

export default UserSummary;
