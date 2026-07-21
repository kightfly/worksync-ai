import type { AttendanceRecordRow, AttendanceStatistics } from '@ai-harness/infrastructure';

const TOKYO_TIME_ZONE = 'Asia/Tokyo';
const TOKYO_OFFSET = '+09:00';

function formatTokyoDateTime(date: Date): string {
  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: TOKYO_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}${TOKYO_OFFSET}`;
}

export interface AttendanceRecordResponse {
  id: string;
  checkInTime: string;
  checkOutTime: string | null;
  workDate: string;
}

export function toAttendanceRecordResponse(
  record: AttendanceRecordRow,
): AttendanceRecordResponse {
  return {
    id: record.id,
    checkInTime: formatTokyoDateTime(record.checkInTime),
    checkOutTime: record.checkOutTime
      ? formatTokyoDateTime(record.checkOutTime)
      : null,
    workDate: record.workDate,
  };
}

export function toAttendanceStatisticsResponse(
  statistics: AttendanceStatistics,
): AttendanceStatistics {
  return statistics;
}
