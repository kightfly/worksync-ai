import { Link } from 'react-router-dom'

export function DashboardPage() {
  return (
    <main className="page">
      <h1>ダッシュボード</h1>
      <p>勤怠・タスク管理の概要です。</p>
      <ul>
        <li>
          <Link to="/tasks">タスク管理へ</Link>
        </li>
        <li>
          <Link to="/attendance">打刻へ</Link>
        </li>
      </ul>
    </main>
  )
}
