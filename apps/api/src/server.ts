import cors from '@fastify/cors';
import Fastify from 'fastify';
import {
  AttendanceRepository,
  getDb,
  TaskRepository,
  UserRepository,
} from '@ai-harness/infrastructure';
import { getEnv } from './config/env.js';
import { createAuthenticate } from './plugins/authenticate.js';
import attendanceRoutes from './routes/attendance.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import { AttendanceService } from './services/attendance.service.js';
import { AuthService } from './services/auth.service.js';
import { TaskService } from './services/task.service.js';

export interface BuildServerOptions {
  authService?: AuthService;
  userRepository?: UserRepository;
  taskService?: TaskService;
  taskRepository?: TaskRepository;
  attendanceService?: AttendanceService;
  attendanceRepository?: AttendanceRepository;
}

export async function buildServer(options: BuildServerOptions = {}) {
  const app = Fastify({ logger: false });
  await app.register(cors, { origin: true });

  app.get('/health', async () => ({ status: 'ok' }));

  const env = getEnv();
  const userRepository = options.userRepository ?? new UserRepository(getDb());
  const taskRepository = options.taskRepository ?? new TaskRepository(getDb());
  const attendanceRepository =
    options.attendanceRepository ?? new AttendanceRepository(getDb());
  const authService =
    options.authService ?? new AuthService(userRepository, env.jwtSecret);
  const taskService = options.taskService ?? new TaskService(taskRepository);
  const attendanceService =
    options.attendanceService ?? new AttendanceService(attendanceRepository);
  const authenticate = createAuthenticate(authService);

  await app.register(authRoutes, { authService });
  await app.register(taskRoutes, { taskService, authenticate });
  await app.register(attendanceRoutes, { attendanceService, authenticate });

  return app;
}