import { useEffect, useState } from 'react'
import { apiFetch, ApiClientError } from '../api/client'

type AttendanceItem = {
  id: string
  checkInTime: string
  checkOutTime: string | null
  workDate: string
}

type StatItem = {
  workDate: string
  totalMinutes: number
  checkInCount: number
}

export function AttendancePage() {
  const [items, setItems] = useState<AttendanceItem[]>([])
  const [stats, setStats] = useState<StatItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const [list, statistics] = await Promise.all([
          apiFetch<{ items: AttendanceItem[] }>('/api/attendance'),
          apiFetch<{ items: StatItem[] }>('/api/attendance/statistics'),
        ])
        setItems(list.items)
        setStats(statistics.items)
      } catch (e) {
        setError(e instanceof ApiClientError ? e.message : '読み込みに失敗しました')
      }
    })()
  }, [])

  return (
    <main className="page">
      <h1>打刻</h1>
      {error && <p role="alert">{error}</p>}

      <section>
        <h2>打刻一覧</h2>
        {items.length === 0 ? (
          <p>打刻記録はありません</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>勤務日</th>
                <th>出勤</th>
                <th>退勤</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{r.workDate}</td>
                  <td>{r.checkInTime}</td>
                  <td>{r.checkOutTime ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>日次集計</h2>
        {stats.length === 0 ? (
          <p>集計データはありません</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>勤務日</th>
                <th>合計（分）</th>
                <th>件数</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.workDate}>
                  <td>{s.workDate}</td>
                  <td>{s.totalMinutes}</td>
                  <td>{s.checkInCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}
