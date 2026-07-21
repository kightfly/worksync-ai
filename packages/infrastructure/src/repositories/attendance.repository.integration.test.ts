import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import { eq } from 'drizzle-orm';
import { closeDb } from '../db/client.js';
import { attendanceRecords, users } from '../db/schema.js';
import { AttendanceRepository } from './attendance.repository.js';
import { UserRepository } from './user.repository.js';
import type { DbClient } from './types.js';
import { getTestDb, hasDatabase, hashPassword, uniqueEmail } from './test-helpers.js';

const describeIfDb = hasDatabase ? describe : describe.skip;

describeIfDb('AttendanceRepository (integration)', () => {
  let db: DbClient;
  let userRepo: UserRepository;
  let attendanceRepo: AttendanceRepository;
  let userId = '';
  const recordIds: string[] = [];

  beforeAll(() => {
    db = getTestDb();
    userRepo = new UserRepository(db);
    attendanceRepo = new AttendanceRepository(db);
  });

  afterAll(async () => {
    for (const id of recordIds) {
      await db.delete(attendanceRecords).where(eq(attendanceRecords.id, id));
    }
    if (userId) {
      await db.delete(users).where(eq(users.id, userId));
    }
    await closeDb();
  });

  it('日付範囲検索と日次集計', async () => {
    const user = await userRepo.create({
      email: uniqueEmail('attendance-repo'),
      passwordHash: await hashPassword('password123'),
      name: '打刻ユーザー',
    });
    userId = user.id;

    const morning = await attendanceRepo.create({
      userId,
      checkInTime: new Date('2025-02-01T00:00:00.000Z'),
      checkOutTime: new Date('2025-02-01T04:00:00.000Z'),
      workDate: '2025-02-01',
    });
    const evening = await attendanceRepo.create({
      userId,
      checkInTime: new Date('2025-02-01T14:00:00.000Z'),
      checkOutTime: new Date('2025-02-01T17:00:00.000Z'),
      workDate: '2025-02-01',
    });
    recordIds.push(morning.id, evening.id);

    const byDate = await attendanceRepo.findByUserIdAndDate(userId, '2025-02-01');
    expect(byDate).toHaveLength(2);

    const byRange = await attendanceRepo.findByUserIdAndDateRange(
      userId,
      '2025-02-01',
      '2025-02-01',
    );
    expect(byRange).toHaveLength(2);

    const stats = await attendanceRepo.getStatistics(
      userId,
      '2025-02-01',
      '2025-02-01',
    );
    expect(stats.dailyStats).toHaveLength(1);
    expect(stats.dailyStats[0]?.date).toBe('2025-02-01');
    expect(stats.totalHours).toBeCloseTo(7, 1);

    const updated = await attendanceRepo.update(evening.id, userId, {
      checkOutTime: new Date('2025-02-01T18:00:00.000Z'),
    });
    expect(updated.checkOutTime?.toISOString()).toBe(
      new Date('2025-02-01T18:00:00.000Z').toISOString(),
    );

    await attendanceRepo.delete(morning.id, userId);
    recordIds.splice(recordIds.indexOf(morning.id), 1);
  });
});