import { useEffect, useState } from 'react';
import { AttendanceList } from '../components/AttendanceList';
import {
  fetchAttendance,
  fetchAttendanceStatistics,
  type AttendanceRecord,
  type AttendanceStatistics,
} from '../lib/api';

interface AttendancePageProps {
  token: string;
  onUnauthorized: () => void;
}

export function AttendancePage({ token, onUnauthorized }: AttendancePageProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [statistics, setStatistics] = useState<AttendanceStatistics | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('2025-01-15');
  const [endDate, setEndDate] = useState('2025-01-16');

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      try {
        const [attendanceResult, statisticsResult] = await Promise.all([
          fetchAttendance(token, startDate, endDate),
          fetchAttendanceStatistics(token, startDate, endDate),
        ]);
        setRecords(attendanceResult.records);
        setStatistics(statisticsResult);
      } catch (error) {
        const message = error instanceof Error ? error.message : '打刻取得に失敗しました';
        setErrorMessage(message);
        if (message.includes('認証')) {
          onUnauthorized();
        }
      } finally {
        setIsLoading(false);
      }
    };
    void run();
  }, [endDate, onUnauthorized, startDate, token]);

  return (
    <main>
      <h1>打刻一覧</h1>
      <label>
        開始日
        <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
      </label>
      <label>
        終了日
        <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
      </label>
      {errorMessage ? <p role="alert">{errorMessage}</p> : null}
      {isLoading ? <p>読み込み中...</p> : <AttendanceList records={records} statistics={statistics} />}
    </main>
  );
}