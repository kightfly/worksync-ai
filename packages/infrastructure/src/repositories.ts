import { and, desc, eq } from 'drizzle-orm'
import type { TaskStatus } from '@gienharness/domain'
import type { Db } from './db.js'
import { tasks, users, attendanceRecords } from './schema.js'

export class UserRepository {
  constructor(private readonly db: Db) {}

  async findByEmail(email: string) {
    const rows = await this.db.select().from(users).where(eq(users.email, email)).limit(1)
    return rows[0] ?? null
  }

  async findById(id: string) {
    const rows = await this.db.select().from(users).where(eq(users.id, id)).limit(1)
    return rows[0] ?? null
  }
}

export class TaskRepository {
  constructor(private readonly db: Db) {}

  async listByUser(userId: string) {
    return this.db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt))
  }

  async findByIdForUser(id: string, userId: string) {
    const rows = await this.db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .limit(1)
    return rows[0] ?? null
  }

  async insert(row: {
    id: string
    userId: string
    title: string
    description: string | null
    status: TaskStatus
    dueDate: string | null
  }) {
    const inserted = await this.db.insert(tasks).values(row).returning()
    return inserted[0]
  }

  async update(
    id: string,
    userId: string,
    patch: {
      title?: string
      description?: string | null
      status?: TaskStatus
      dueDate?: string | null
    },
  ) {
    const updated = await this.db
      .update(tasks)
      .set({ ...patch, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning()
    return updated[0] ?? null
  }

  async delete(id: string, userId: string) {
    const deleted = await this.db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning()
    return deleted[0] ?? null
  }
}

export class AttendanceRepository {
  constructor(private readonly db: Db) {}

  async listByUser(userId: string, startDate?: string, endDate?: string) {
    const rows = await this.db
      .select()
      .from(attendanceRecords)
      .where(eq(attendanceRecords.userId, userId))
      .orderBy(desc(attendanceRecords.checkInTime))

    return rows.filter((r) => {
      if (startDate && r.workDate < startDate) return false
      if (endDate && r.workDate > endDate) return false
      return true
    })
  }
}
