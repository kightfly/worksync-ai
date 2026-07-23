import Fastify from 'fastify'
import cors from '@fastify/cors'
import {
  AttendanceRepository,
  TaskRepository,
  UserRepository,
  createDb,
  type Db,
} from '@gienharness/infrastructure'
import { authPlugin } from './auth/plugin.js'
import { registerAuthRoutes } from './routes/auth.js'
import { registerTaskRoutes } from './routes/tasks.js'
import { registerAttendanceRoutes } from './routes/attendance.js'

export type AppDeps = {
  db: Db
}

export async function buildApp(deps: AppDeps) {
  const app = Fastify({ logger: false })
  await app.register(cors, { origin: true })

  const users = new UserRepository(deps.db)
  const tasks = new TaskRepository(deps.db)
  const attendance = new AttendanceRepository(deps.db)

  await authPlugin(app)

  app.get('/health', async () => ({ status: 'ok' }))
  registerAuthRoutes(app, users)
  registerTaskRoutes(app, tasks)
  registerAttendanceRoutes(app, attendance)

  return app
}

export async function buildAppFromEnv() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is required')
  const db = createDb(url)
  return buildApp({ db })
}
