import { describe, expect, it } from 'vitest'
import { formatTokyoIso, workDateFromCheckInUtc } from './datetime.js'

describe('datetime', () => {
  it('UTC 瞬間を Asia/Tokyo オフセット付き ISO に整形する', () => {
    // 2026-07-21 15:00:00Z = 2026-07-22 00:00:00+09:00
    const iso = formatTokyoIso(new Date('2026-07-21T15:00:00.000Z'))
    expect(iso).toContain('+09:00')
    expect(iso.startsWith('2026-07-22')).toBe(true)
  })

  it('出勤が Tokyo 23:00・退勤が翌日でも work_date は出勤日', () => {
    // Tokyo 2026-07-21 23:00 = UTC 2026-07-21 14:00
    const checkIn = new Date('2026-07-21T14:00:00.000Z')
    const workDate = workDateFromCheckInUtc(checkIn)
    expect(workDate).toBe('2026-07-21')
  })

  it('Tokyo 0 点直後の出勤は新しい work_date', () => {
    // Tokyo 2026-07-22 00:30 = UTC 2026-07-21 15:30
    const checkIn = new Date('2026-07-21T15:30:00.000Z')
    expect(workDateFromCheckInUtc(checkIn)).toBe('2026-07-22')
  })
})
