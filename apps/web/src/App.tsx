import { useMemo, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { logout, type AuthUser } from './lib/api';
import { AttendancePage } from './pages/AttendancePage';
import { LoginPage } from './pages/LoginPage';
import { TasksPage } from './pages/TasksPage';

const TOKEN_STORAGE_KEY = 'ai-harness-token';
const USER_STORAGE_KEY = 'ai-harness-user';

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

function ProtectedRoute({
  token,
  children,
}: {
  token: string | null;
  children: React.ReactNode;
}) {
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}

function AppShell() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

  const authActions = useMemo(
    () => ({
      onLogin(nextToken: string, nextUser: AuthUser) {
        localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
        setToken(nextToken);
        setUser(nextUser);
        setLogoutMessage(null);
      },
      clearAuth(message?: string) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        setToken(null);
        setUser(null);
        setLogoutMessage(message ?? null);
      },
    }),
    [],
  );

  return (
    <>
      <header>
        <nav>
          <Link to="/tasks">タスク</Link>{' '}
          <Link to="/attendance">打刻</Link>{' '}
          {token ? (
            <button
              type="button"
              onClick={() => {
                void (async () => {
                  try {
                    if (token) {
                      const result = await logout(token);
                      authActions.clearAuth(result.message);
                    }
                  } catch {
                    authActions.clearAuth('ログアウトしました');
                  }
                })();
              }}
            >
              ログアウト
            </button>
          ) : null}
        </nav>
        {user ? <p>ようこそ、{user.name ?? user.email}</p> : null}
        {logoutMessage ? <p>{logoutMessage}</p> : null}
      </header>
      <Routes>
        <Route path="/login" element={<LoginPage token={token} onLogin={authActions.onLogin} />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute token={token}>
              <TasksPage token={token ?? ''} onUnauthorized={() => authActions.clearAuth()} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute token={token}>
              <AttendancePage token={token ?? ''} onUnauthorized={() => authActions.clearAuth()} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={token ? '/tasks' : '/login'} replace />} />
      </Routes>
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}