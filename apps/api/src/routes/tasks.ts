import {
  InvalidStateTransitionError,
  TaskLockedError,
} from '@ai-harness/domain';
import type { FastifyPluginAsync } from 'fastify';
import { NotFoundError } from '../errors/not-found-error.js';
import { toTaskResponse } from '../lib/task-mapper.js';
import type { AuthenticateHook } from '../plugins/authenticate.js';
import {
  createTaskSchema,
  taskListQuerySchema,
  updateTaskSchema,
} from '../schemas/task.schema.js';
import type { TaskService } from '../services/task.service.js';

export interface TaskRouteOptions {
  taskService: TaskService;
  authenticate: AuthenticateHook;
}

const taskRoutes: FastifyPluginAsync<TaskRouteOptions> = async (app, opts) => {
  app.get(
    '/api/tasks',
    { preHandler: [opts.authenticate] },
    async (request, reply) => {
      const query = taskListQuerySchema.safeParse(request.query);
      if (!query.success) {
        return reply.status(400).send({
          error: 'VALIDATION_ERROR',
          message: query.error.errors[0]?.message ?? '入力内容が正しくありません',
        });
      }

      const tasks = await opts.taskService.listTasks(
        request.user.userId,
        query.data.status,
      );
      return reply.send({ tasks: tasks.map(toTaskResponse) });
    },
  );

  app.post(
    '/api/tasks',
    { preHandler: [opts.authenticate] },
    async (request, reply) => {
      const parsed = createTaskSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'VALIDATION_ERROR',
          message: parsed.error.errors[0]?.message ?? '入力内容が正しくありません',
        });
      }

      try {
        const task = await opts.taskService.createTask(
          request.user.userId,
          parsed.data,
        );
        return reply.status(201).send(toTaskResponse(task));
      } catch (error) {
        if (error instanceof Error && error.message.includes('タイトル')) {
          return reply.status(400).send({
            error: 'VALIDATION_ERROR',
            message: error.message,
          });
        }
        throw error;
      }
    },
  );

  app.patch(
    '/api/tasks/:id',
    { preHandler: [opts.authenticate] },
    async (request, reply) => {
      const parsed = updateTaskSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'VALIDATION_ERROR',
          message: parsed.error.errors[0]?.message ?? '入力内容が正しくありません',
        });
      }

      const { id } = request.params as { id: string };

      try {
        const task = await opts.taskService.updateTask(
          request.user.userId,
          id,
          parsed.data,
        );
        return reply.send(toTaskResponse(task));
      } catch (error) {
        if (error instanceof NotFoundError) {
          return reply.status(404).send({
            error: error.code,
            message: error.message,
          });
        }
        if (error instanceof InvalidStateTransitionError) {
          return reply.status(400).send({
            error: error.code,
            message: error.message,
          });
        }
        if (error instanceof TaskLockedError) {
          return reply.status(400).send({
            error: error.code,
            message: error.message,
          });
        }
        if (error instanceof Error && error.message.includes('タイトル')) {
          return reply.status(400).send({
            error: 'VALIDATION_ERROR',
            message: error.message,
          });
        }
        throw error;
      }
    },
  );

  app.delete(
    '/api/tasks/:id',
    { preHandler: [opts.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      try {
        await opts.taskService.deleteTask(request.user.userId, id);
        return reply.status(204).send();
      } catch (error) {
        if (error instanceof NotFoundError) {
          return reply.status(404).send({
            error: error.code,
            message: error.message,
          });
        }
        throw error;
      }
    },
  );
};

export default taskRoutes;