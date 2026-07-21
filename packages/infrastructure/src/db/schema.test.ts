import { describe, it, expect } from 'vitest';
import { attendanceRecords, tasks, users } from './schema.js';

describe('schema', () => {
  it('users / tasks / attendance_records テーブル定義をエクスポートする', () => {
    expect(users).toBeDefined();
    expect(tasks).toBeDefined();
    expect(attendanceRecords).toBeDefined();
  });
});