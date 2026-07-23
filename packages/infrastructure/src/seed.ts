import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { createDb, requireDatabaseUrl } from './db.js'
import { attendanceRecords, users } from './schema.js'
import { loadRepoEnv } from './load-env.js'

async function main() {
  loadRepoEnv()
  const saltRounds = Number(process.env.SALT_ROUNDS ?? 10)
  const db = createDb(requireDatabaseUrl())

  const email = 'test@example.com'
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)

  let userId: string
  if (existing[0]) {
    userId = existing[0].id
    console.log('seed user exists', userId)
  } else {
    const passwordHash = await bcrypt.hash('password123', saltRounds)
    const inserted = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name: 'テストユーザー',
        isActive: true,
      })
      .returning()
    userId = inserted[0].id
    console.log('seed user created', userId)
  }

  // Idempotent: reset demo attendance to known Tokyo scenarios for E2E/integration
  await db.delete(attendanceRecords).where(eq(attendanceRecords.userId, userId))
  await db.insert(attendanceRecords).values([
    {
      userId,
      // Tokyo 2026-07-20 09:00-18:00
      checkInTime: new Date('2026-07-20T00:00:00.000Z'),
      checkOutTime: new Date('2026-07-20T09:00:00.000Z'),
      workDate: '2026-07-20',
    },
    {
      userId,
      // Tokyo 2026-07-21 23:00 → 2026-07-22 02:00
      checkInTime: new Date('2026-07-21T14:00:00.000Z'),
      checkOutTime: new Date('2026-07-21T17:00:00.000Z'),
      workDate: '2026-07-21',
    },
  ])
  console.log('seed attendance reset')

  console.log('seed ok')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
