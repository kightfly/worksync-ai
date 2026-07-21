import type { AttendanceRecord, AttendanceStatistics } from '../lib/api';

interface AttendanceListProps {
  records: AttendanceRecord[];
  statistics: AttendanceStatistics | null;
}

export function AttendanceList({ records, statistics }: AttendanceListProps) {
  return (
    <section>
      {records.length === 0 ? <p className="muted">打刻記録はありません</p> : null}
      {records.length > 0 ? (
        <ul className="attendance-list">
          {records.map((record) => (
            <li className="attendance-item" key={record.id}>
              <p>勤務日: {record.workDate}</p>
              <p>出勤: {record.checkInTime}</p>
              <p>退勤: {record.checkOutTime ?? '未退勤'}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {statistics ? (
        <section aria-label="日次集計" className="stats-card">
          <h3>日次集計</h3>
          <ul className="stats-list">
            {statistics.dailyStats.map((stat) => (
              <li key={stat.date}>
                {stat.date}: {stat.workHours} 時間
              </li>
            ))}
          </ul>
          <p>合計: {statistics.totalHours} 時間</p>
        </section>
      ) : null}
    </section>
  );
}