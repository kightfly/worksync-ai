import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { loadEnv } from './test/load-env.js'
import { buildApp } from './app.js'
import { hashPassword } from './auth/jwt.js'
import {
  attendanceRecords,
  createDb,
  tasks,
  users,
  type Db,
} from '@gienharness/infrastructure'

loadEnv()

type ErrBody = { error: { code: string; message: string } }
type LoginBody = { token: string; user: { id: string; email: string; name: string } }
type TaskBody = {
  id: string
  title: string
  status: string
  createdAt: string
}
type TaskListBody = { items: TaskBody[] }
type AttendanceListBody = {
  items: Array<{
    id: string
    checkInTime: string
    checkOutTime: string | null
    workDate: string
  }>
}
type StatsBody = {
  items: Array<{ workDate: string; totalMinutes: number; checkInCount: number }>
}

describe('API integration (real DB)', () => {
  let db: Db
  let app: Awaited<ReturnType<typeof buildApp>>
  let userAId = ''
  let userBId = ''
  let tokenA = ''
  let tokenB = ''
  const password = 'password123'
  const emailA = `int-a-${randomUUID()}@example.com`
  const emailB = `int-b-${randomUUID()}@example.com`

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required for integration tests')
    }
    db = createDb(process.env.DATABASE_URL)
    app = await buildApp({ db })

    const passwordHash = await hashPassword(password)
    const [a] = await db
      .insert(users)
      .values({ email: emailA, passwordHash, name: 'Integration User A' })
      .returning()
    const [b] = await db
      .insert(users)
      .values({ email: emailB, passwordHash, name: 'Integration User B' })
      .returning()
    userAId = a.id
    userBId = b.id

    // Seed-equivalent attendance for V-019/021/022 (Tokyo times stored as UTC)
    await db.insert(attendanceRecords).values([
      {
        userId: userAId,
        checkInTime: new Date('2026-07-20T00:00:00.000Z'),
        checkOutTime: new Date('2026-07-20T09:00:00.000Z'),
        workDate: '2026-07-20',
      },
      {
        userId: userAId,
        checkInTime: new Date('2026-07-21T14:00:00.000Z'),
        checkOutTime: new Date('2026-07-21T17:00:00.000Z'),
        workDate: '2026-07-21',
      },
    ])

    const loginA = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: emailA, password },
    })
    const loginB = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: emailB, password },
    })
    expect(loginA.statusCode).toBe(200)
    expect(loginB.statusCode).toBe(200)
    tokenA = (loginA.json() as LoginBody).token
    tokenB = (loginB.json() as LoginBody).token
  })

  afterAll(async () => {
    if (userAId) {
      await db.delete(attendanceRecords).where(eq(attendanceRecords.userId, userAId))
      await db.delete(tasks).where(eq(tasks.userId, userAId))
      await db.delete(users).where(eq(users.id, userAId))
    }
    if (userBId) {
      await db.delete(attendanceRecords).where(eq(attendanceRecords.userId, userBId))
      await db.delete(tasks).where(eq(tasks.userId, userBId))
      await db.delete(users).where(eq(users.id, userBId))
    }
    await app.close()
  })

  it('V-023 health returns ok without auth', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({ status: 'ok' })
  })

  it('V-001 login success returns token and user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: emailA, password },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json() as LoginBody
    expect(body.token).toBeTruthy()
    expect(body.user.email).toBe(emailA)
  })

  it('V-003 login failure returns unified Japanese message', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: emailA, password: 'wrong-password' },
    })
    expect(res.statusCode).toBe(401)
    const body = res.json() as ErrBody
    expect(body.error.code).toBe('UNAUTHORIZED')
    expect(body.error.message).toBe(
      '\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u307e\u305f\u306f\u30d1\u30b9\u30ef\u30fc\u30c9\u304c\u6b63\u3057\u304f\u3042\u308a\u307e\u305b\u3093',
    )
  })

  it('V-006 protected route without token returns 401', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/tasks' })
    expect(res.statusCode).toBe(401)
  })

  it('V-007 create task defaults to todo', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { title: 'Integration Task', description: 'desc' },
    })
    expect(res.statusCode).toBe(201)
    const body = res.json() as TaskBody
    expect(body.title).toBe('Integration Task')
    expect(body.status).toBe('todo')
  })

  it('V-008 create task with empty title returns 400', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { title: '' },
    })
    expect(res.statusCode).toBe(400)
    expect((res.json() as ErrBody).error.code).toBe('VALIDATION_ERROR')
  })

  it('V-009 list tasks ordered by createdAt desc', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { title: 'Older Task' },
    })
    await new Promise((r) => setTimeout(r, 20))
    await app.inject({
      method: 'POST',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { title: 'Newer Task' },
    })
    const list = await app.inject({
      method: 'GET',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${tokenA}` },
    })
    expect(list.statusCode).toBe(200)
    const items = (list.json() as TaskListBody).items
    expect(items.length).toBeGreaterThanOrEqual(2)
    for (let i = 1; i < items.length; i++) {
      expect(Date.parse(items[i - 1].createdAt)).toBeGreaterThanOrEqual(Date.parse(items[i].createdAt))
    }
    expect(items.some((t) => t.status === 'todo')).toBe(true)
  })

  it('V-011/V-012 status todo -> in_progress -> done', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { title: 'Status Flow' },
    })
    const id = (created.json() as TaskBody).id

    const toProgress = await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${id}`,
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { status: 'in_progress' },
    })
    expect(toProgress.statusCode).toBe(200)
    expect((toProgress.json() as TaskBody).status).toBe('in_progress')

    const toDone = await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${id}`,
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { status: 'done' },
    })
    expect(toDone.statusCode).toBe(200)
    expect((toDone.json() as TaskBody).status).toBe('done')
  })

  it('V-013 in_progress -> todo is allowed', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { title: 'Back to Todo' },
    })
    const id = (created.json() as TaskBody).id
    await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${id}`,
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { status: 'in_progress' },
    })
    const back = await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${id}`,
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { status: 'todo' },
    })
    expect(back.statusCode).toBe(200)
    expect((back.json() as TaskBody).status).toBe('todo')
  })

  it('V-014 todo -> done is rejected', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { title: 'Illegal Jump' },
    })
    const id = (created.json() as TaskBody).id
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${id}`,
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { status: 'done' },
    })
    expect(res.statusCode).toBe(400)
    const body = res.json() as ErrBody
    expect(body.error.code).toBe('INVALID_STATE_TRANSITION')
    expect(body.error.message).toBe('\u7121\u52b9\u306a\u72b6\u614b\u9077\u79fb\u3067\u3059')
  })

  it('V-015 done task rejects status/content patch', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { title: 'Done Locked' },
    })
    const id = (created.json() as TaskBody).id
    await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${id}`,
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { status: 'in_progress' },
    })
    await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${id}`,
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { status: 'done' },
    })
    const patchStatus = await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${id}`,
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { status: 'todo' },
    })
    expect(patchStatus.statusCode).toBe(400)
    const patchTitle = await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${id}`,
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { title: 'Should Fail' },
    })
    expect(patchTitle.statusCode).toBe(400)
  })

  it('V-016 non-done task can update title', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { title: 'Before Update' },
    })
    const id = (created.json() as TaskBody).id
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${id}`,
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { title: 'After Update' },
    })
    expect(res.statusCode).toBe(200)
    expect((res.json() as TaskBody).title).toBe('After Update')
  })

  it('V-019 attendance times are Tokyo +09:00', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/attendance',
      headers: { authorization: `Bearer ${tokenA}` },
    })
    expect(res.statusCode).toBe(200)
    const items = (res.json() as AttendanceListBody).items
    expect(items.length).toBeGreaterThanOrEqual(2)
    for (const row of items) {
      expect(row.checkInTime).toContain('+09:00')
      if (row.checkOutTime) expect(row.checkOutTime).toContain('+09:00')
    }
  })

  it('V-021 daily statistics minutes match seed scenario', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/attendance/statistics',
      headers: { authorization: `Bearer ${tokenA}` },
    })
    expect(res.statusCode).toBe(200)
    const items = (res.json() as StatsBody).items
    const d20 = items.find((i) => i.workDate === '2026-07-20')
    const d21 = items.find((i) => i.workDate === '2026-07-21')
    expect(d20?.totalMinutes).toBe(540)
    expect(d21?.totalMinutes).toBe(180)
  })

  it('V-022 cross-day attendance uses work_date of check-in Tokyo day', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/attendance',
      headers: { authorization: `Bearer ${tokenA}` },
    })
    const items = (res.json() as AttendanceListBody).items
    const cross = items.find((i) => i.workDate === '2026-07-21')
    expect(cross).toBeTruthy()
    expect(cross!.checkInTime).toContain('2026-07-21T23:00:00+09:00')
    expect(cross!.checkOutTime).toContain('2026-07-22T02:00:00+09:00')
  })

  it('V-024 user A cannot patch user B task', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      headers: { authorization: `Bearer ${tokenB}` },
      payload: { title: 'Only B Task' },
    })
    const id = (created.json() as TaskBody).id
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${id}`,
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { title: 'Hijack' },
    })
    expect(res.statusCode).toBe(404)
  })
})
