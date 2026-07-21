import { and, asc, eq, gte, lte, sql } from 'drizzle-orm';
import { attendanceRecords } from '../db/schema.js';
import type {
  AttendanceRecordRow,
  AttendanceStatistics,
  CreateAttendanceData,
  DbClient,
  UpdateAttendanceData,
} from './types.js';

function mapRow(row: typeof attendanceRecords.$inferSelect): AttendanceRecordRow {
  return {
    id: row.id,
    userId: row.userId,
    checkInTime: row.checkInTime,
    checkOutTime: row.checkOutTime,
    workDate: row.workDate,
    createdAt: row.createdAt,
  };
}

export class AttendanceRepository {
  constructor(private readonly db: DbClient) {}

  async withTransaction<T>(
    fn: (repo: AttendanceRepository) => Promise<T>,
  ): Promise<T> {
    return this.db.transaction(async (tx) => fn(new AttendanceRepository(tx)));
  }

  async findByUserIdAndDate(
    userId: string,
    date: string,
  ): Promise<AttendanceRecordRow[]> {
    const rows = await this.db
      .select()
      .from(attendanceRecords)
      .where(
        and(eq(attendanceRecords.userId, userId), eq(attendanceRecords.workDate, date)),
      )
      .orderBy(asc(attendanceRecords.checkInTime));
    return rows.map(mapRow);
  }

  async findByUserIdAndDateRange(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<AttendanceRecordRow[]> {
    const rows = await this.db
      .select()
      .from(attendanceRecords)
      .where(
        and(
          eq(attendanceRecords.userId, userId),
          gte(attendanceRecords.workDate, startDate),
          lte(attendanceRecords.workDate, endDate),
        ),
      )
      .orderBy(asc(attendanceRecords.workDate), asc(attendanceRecords.checkInTime));
    return rows.map(mapRow);
  }

  async create(data: CreateAttendanceData): Promise<AttendanceRecordRow> {
    const [row] = await this.db
      .insert(attendanceRecords)
      .values({
        id: data.id,
        userId: data.userId,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime ?? null,
        workDate: data.workDate,
      })
      .returning();

    if (!row) {
      throw new Error('打刻記録の作成に失敗しました');
    }
    return mapRow(row);
  }

  async update(
    id: string,
    userId: string,
    data: UpdateAttendanceData,
  ): Promise<AttendanceRecordRow> {
    const [row] = await this.db
      .update(attendanceRecords)
      .set({
        ...(data.checkInTime !== undefined
          ? { checkInTime: data.checkInTime }
          : {}),
        ...(data.checkOutTime !== undefined
          ? { checkOutTime: data.checkOutTime }
          : {}),
        ...(data.workDate !== undefined ? { workDate: data.workDate } : {}),
      })
      .where(
        and(eq(attendanceRecords.id, id), eq(attendanceRecords.userId, userId)),
      )
      .returning();

    if (!row) {
      throw new Error('打刻記録が見つかりません');
    }
    return mapRow(row);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.db
      .delete(attendanceRecords)
      .where(
        and(eq(attendanceRecords.id, id), eq(attendanceRecords.userId, userId)),
      );
  }

  async getStatistics(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<AttendanceStatistics> {
    const rows = await this.db
      .select({
        date: attendanceRecords.workDate,
        workHours: sql<number>`COALESCE(SUM(
          CASE
            WHEN ${attendanceRecords.checkOutTime} IS NULL THEN 0
            ELSE EXTRACT(EPOCH FROM (${attendanceRecords.checkOutTime} - ${attendanceRecords.checkInTime})) / 3600
          END
        ), 0)`,
      })
      .from(attendanceRecords)
      .where(
        and(
          eq(attendanceRecords.userId, userId),
          gte(attendanceRecords.workDate, startDate),
          lte(attendanceRecords.workDate, endDate),
        ),
      )
      .groupBy(attendanceRecords.workDate)
      .orderBy(asc(attendanceRecords.workDate));

    const dailyStats = rows.map((row) => ({
      date: row.date,
      workHours: Number(row.workHours),
    }));

    const totalHours = dailyStats.reduce((sum, stat) => sum + stat.workHours, 0);

    return { dailyStats, totalHours };
  }
}