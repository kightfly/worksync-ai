import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '../db/schema.js';

export type DbClient = NodePgDatabase<typeof schema>;

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  passwordHash: string;
  name?: string | null;
  id?: string;
}

export interface UpdateUserData {
  email?: string;
  passwordHash?: string;
  name?: string | null;
  isActive?: boolean;
}

export interface CreateTaskData {
  userId: string;
  title: string;
  description?: string | null;
  status?: string;
  dueDate?: string | null;
  id?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  status?: string;
  dueDate?: string | null;
}

export interface TaskFilters {
  status?: string;
}

export interface AttendanceRecordRow {
  id: string;
  userId: string;
  checkInTime: Date;
  checkOutTime: Date | null;
  workDate: string;
  createdAt: Date;
}

export interface CreateAttendanceData {
  userId: string;
  checkInTime: Date;
  checkOutTime?: Date | null;
  workDate: string;
  id?: string;
}

export interface UpdateAttendanceData {
  checkInTime?: Date;
  checkOutTime?: Date | null;
  workDate?: string;
}

export interface DailyWorkStat {
  date: string;
  workHours: number;
}

export interface AttendanceStatistics {
  dailyStats: DailyWorkStat[];
  totalHours: number;
}