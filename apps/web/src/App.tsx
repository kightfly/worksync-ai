import { useMemo, useState } from 'react';
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { logout, type AuthUser } from './lib/api';
import { AttendancePage } from './pages/AttendancePage';
import { DashboardPage } from './pages/DashboardPage';
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand">勤怠・タスク管理</div>
          {token && user ? (
            <div className="user-menu">
              <button
                className="user-menu-trigger"
                type="button"
                onClick={() => setIsUserMenuOpen((current) => !current)}
              >
                <span className="user-avatar">{(user.name ?? user.email).slice(0, 1).toUpperCase()}</span>
                <span className="user-menu-text">
                  <span className="user-name">{user.name ?? user.email}</span>
                  <span className="user-role muted">管理者</span>
                </span>
                <span className="user-menu-caret">▾</span>
              </button>
              {isUserMenuOpen ? (
                <div className="user-menu-dropdown">
                  <button
                    className="user-menu-item"
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
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
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      <div className="workspace">
        {token ? (
          <aside className="sidebar">
            <div className="sidebar-group">
              <p className="sidebar-label">メニュー</p>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `sidebar-link${isActive ? ' sidebar-link-active' : ''}`}
              >
                ダッシュボード
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) => `sidebar-link${isActive ? ' sidebar-link-active' : ''}`}
              >
                タスク管理
              </NavLink>
              <NavLink
                to="/attendance"
                className={({ isActive }) => `sidebar-link${isActive ? ' sidebar-link-active' : ''}`}
              >
                打刻
              </NavLink>
            </div>
          </aside>
        ) : null}

        <div className="page">
          {logoutMessage ? <p className="notice">{logoutMessage}</p> : null}

          <Routes>
            <Route path="/login" element={<LoginPage token={token} onLogin={authActions.onLogin} />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute token={token}>
                  <DashboardPage token={token ?? ''} onUnauthorized={() => authActions.clearAuth()} />
                </ProtectedRoute>
              }
            />
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
            <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}