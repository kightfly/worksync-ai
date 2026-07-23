import { describe, expect, it } from 'vitest'
import { attendanceRecords, tasks, users } from './schema.js'

describe('schema', () => {
  it('users / tasks / attendance_records テーブルを定義する', () => {
    expect(users).toBeDefined()
    expect(tasks).toBeDefined()
    expect(attendanceRecords).toBeDefined()
  })
})
