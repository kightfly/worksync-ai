import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">勤怠・タスク管理</div>
        <nav>
          <NavLink to="/dashboard">ダッシュボード</NavLink>
          <NavLink to="/tasks">タスク管理</NavLink>
          <NavLink to="/attendance">打刻</NavLink>
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <span>{user?.name ?? 'ユーザー'}</span>
          <button
            type="button"
            onClick={async () => {
              await logout()
              navigate('/login', { replace: true })
            }}
          >
            ログアウト
          </button>
        </header>
        <Outlet />
      </div>
    </div>
  )
}
