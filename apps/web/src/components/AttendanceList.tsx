import type { AttendanceRecord, AttendanceStatistics } from '../lib/api';

interface AttendanceListProps {
  records: AttendanceRecord[];
  statistics: AttendanceStatistics | null;
}

export function AttendanceList({ records, statistics }: AttendanceListProps) {
  return (
    <section>
      {records.length === 0 ? <p>打刻記録はありません</p> : null}
      {records.length > 0 ? (
        <ul>
          {records.map((record) => (
            <li key={record.id}>
              <p>勤務日: {record.workDate}</p>
              <p>出勤: {record.checkInTime}</p>
              <p>退勤: {record.checkOutTime ?? '未退勤'}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {statistics ? (
        <section aria-label="日次集計">
          <h3>日次集計</h3>
          <ul>
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