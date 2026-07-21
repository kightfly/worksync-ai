import type { AttendanceRecordRow, AttendanceRepository, AttendanceStatistics } from '@ai-harness/infrastructure';

export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  async listAttendance(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<AttendanceRecordRow[]> {
    return this.attendanceRepository.findByUserIdAndDateRange(
      userId,
      startDate,
      endDate,
    );
  }

  async getStatistics(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<AttendanceStatistics> {
    return this.attendanceRepository.getStatistics(userId, startDate, endDate);
  }
}
