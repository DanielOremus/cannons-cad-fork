import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { getAdminUsers, updateAdminUser } from '@/features/admin/users/api/adminUsersApi';
import { AdminUsersToolbar } from '@/features/admin/users/components/AdminUsersToolbar';
import { UsersTable } from '@/features/admin/users/components/UsersTable';
import { UsersTableSkeleton } from '@/features/admin/users/components/UsersTableSkeleton';
import type {
  AdminSortOrder,
  AdminStatusFilter,
  AdminUser,
  AdminUserSortOption,
  AdminUserUpdate,
  AdminUsersResponse,
} from '@/features/admin/users/model/adminUsers.types';
import { useAuth } from '@/features/auth/context/AuthContext';
import { ApiError } from '@/shared/api/apiError';
import { BrandMark } from '@/shared/components/BrandMark';

const USERS_PAGE_LIMIT = 10;

function AdminPage() {
  const { accessToken, user: currentUser, clearAuthSession } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<AdminStatusFilter>('all');
  const [sortBy, setSortBy] = useState<AdminUserSortOption>('createdAt');
  const [sortOrder, setSortOrder] = useState<AdminSortOrder>('desc');
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / USERS_PAGE_LIMIT)),
    [total],
  );

  const handleRequestError = useCallback(
    (requestError: unknown, fallback: string) => {
      if (requestError instanceof ApiError) {
        if (requestError.status === 401) {
          clearAuthSession();
          void navigate('/', { replace: true });
          return;
        }

        if (requestError.status === 403) {
          setAccessDenied(true);
          setError('');
          return;
        }

        setError(requestError.message);
        return;
      }

      setError(fallback);
    },
    [clearAuthSession, navigate],
  );

  const loadUsers = useCallback(
    async ({ showLoading = true }: { showLoading?: boolean } = {}) => {
      if (!accessToken) {
        clearAuthSession();
        void navigate('/', { replace: true });
        return;
      }

      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setError('');
      setAccessDenied(false);

      try {
        const response: AdminUsersResponse = await getAdminUsers(
          {
            page,
            limit: USERS_PAGE_LIMIT,
            status: statusFilter === 'all' ? undefined : statusFilter,
            sortBy,
            sortOrder,
          },
          accessToken,
        );

        setUsers(response.items);
        setTotal(response.total);
      } catch (loadError) {
        handleRequestError(loadError, 'Users could not be loaded. Try again.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [
      accessToken,
      clearAuthSession,
      handleRequestError,
      navigate,
      page,
      sortBy,
      sortOrder,
      statusFilter,
    ],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadUsers]);

  async function handleSaveUser(userId: string, update: AdminUserUpdate) {
    if (!accessToken) {
      clearAuthSession();
      void navigate('/', { replace: true });
      return;
    }

    await updateAdminUser(userId, update, accessToken);
    await loadUsers({ showLoading: false });
  }

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages && page * USERS_PAGE_LIMIT < total;
  const visibleStart = total === 0 ? 0 : (page - 1) * USERS_PAGE_LIMIT + 1;
  const visibleEnd = Math.min(page * USERS_PAGE_LIMIT, total);

  function changeStatusFilter(nextStatus: AdminStatusFilter) {
    setStatusFilter(nextStatus);
    setPage(1);
  }

  function changeSortBy(nextSortBy: AdminUserSortOption) {
    setSortBy(nextSortBy);
    setPage(1);
  }

  function changeSortOrder(nextSortOrder: AdminSortOrder) {
    setSortOrder(nextSortOrder);
    setPage(1);
  }

  function resetQuery() {
    setStatusFilter('all');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  }

  if (accessDenied) {
    return (
      <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
          <BrandMark compact />
          <p className="mt-6 text-xs font-medium uppercase tracking-wide text-primary">
            Access denied
          </p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight">
            User management is restricted
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You do not have permission to manage users.
          </p>
          <Link
            className="mt-5 inline-flex h-8 items-center justify-center rounded-lg border border-border bg-secondary px-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:border-border-strong hover:bg-surface-hover focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            to="/"
          >
            Return to sign in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-5 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <BrandMark compact />
            <h1 className="mt-5 text-2xl font-semibold leading-tight tracking-normal">
              User Management
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Review users, approve accounts and manage roles.
            </p>
          </div>
          <Link
            className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-secondary px-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:border-border-strong hover:bg-surface-hover focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            to="/"
          >
            Back to account
          </Link>
        </div>

        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertTitle>Request failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AdminUsersToolbar
          statusFilter={statusFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          disabled={isLoading}
          onStatusFilterChange={changeStatusFilter}
          onSortByChange={changeSortBy}
          onSortOrderChange={changeSortOrder}
          onReset={resetQuery}
        />

        {isLoading ? (
          <UsersTableSkeleton />
        ) : (
          <UsersTable
            users={users}
            currentUserRoles={currentUser?.roles ?? []}
            onSaveUser={handleSaveUser}
          />
        )}

        <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite">
            Showing {visibleStart}-{visibleEnd} of {total} users
            {isRefreshing ? ' - refreshing...' : ''}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={!canGoPrevious || isLoading}
              onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={!canGoNext || isLoading}
              onClick={() => setPage((currentPage) => currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminPage;
