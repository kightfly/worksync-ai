import type { FastifyInstance } from 'fastify'
import { Task, TaskDomainError, type TaskStatus, formatTokyoIso } from '@gienharness/domain'
import type { TaskRepository } from '@gienharness/infrastructure'
import { z } from 'zod'
import { invalidState, notFound, validationError } from '../errors.js'
import { requireUserId, sendApiError } from '../auth/plugin.js'

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
})

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
})

function mapTask(row: {
  id: string
  title: string
  description: string | null
  status: string
  dueDate: string | null
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    dueDate: row.dueDate,
    createdAt: formatTokyoIso(row.createdAt),
    updatedAt: formatTokyoIso(row.updatedAt),
  }
}

export function registerTaskRoutes(app: FastifyInstance, tasks: TaskRepository) {
  app.get('/api/tasks', async (request, reply) => {
    try {
      const userId = requireUserId(request)
      const rows = await tasks.listByUser(userId)
      return reply.send({ items: rows.map(mapTask) })
    } catch (err) {
      return sendApiError(reply, err)
    }
  })

  app.post('/api/tasks', async (request, reply) => {
    try {
      const userId = requireUserId(request)
      const parsed = createSchema.safeParse(request.body)
      if (!parsed.success) {
        throw validationError('タイトルは必須です')
      }
      let domain: Task
      try {
        domain = Task.create({
          title: parsed.data.title,
          userId,
          description: parsed.data.description ?? null,
          dueDate: parsed.data.dueDate ?? null,
        })
      } catch (e: unknown) {
        if (e instanceof TaskDomainError) {
          throw validationError(e.message)
        }
        throw e
      }
      const row = await tasks.insert({
        id: domain.id,
        userId: domain.userId,
        title: domain.title,
        description: domain.description,
        status: domain.status,
        dueDate: domain.dueDate,
      })
      return reply.status(201).send(mapTask(row))
    } catch (err) {
      return sendApiError(reply, err)
    }
  })

  app.patch('/api/tasks/:id', async (request, reply) => {
    try {
      const userId = requireUserId(request)
      const { id } = request.params as { id: string }
      const parsed = patchSchema.safeParse(request.body)
      if (!parsed.success || Object.keys(parsed.data).length === 0) {
        throw validationError('更新内容が不正です')
      }
      const row = await tasks.findByIdForUser(id, userId)
      if (!row) throw notFound()

      const domain = Task.restore({
        id: row.id,
        userId: row.userId,
        title: row.title,
        description: row.description,
        status: row.status as TaskStatus,
        dueDate: row.dueDate,
      })

      try {
        if (parsed.data.status !== undefined) {
          domain.transitionTo(parsed.data.status)
        }
        if (
          parsed.data.title !== undefined ||
          parsed.data.description !== undefined ||
          parsed.data.dueDate !== undefined
        ) {
          domain.updateContent({
            title: parsed.data.title,
            description: parsed.data.description,
            dueDate: parsed.data.dueDate,
          })
        }
      } catch (e: unknown) {
        if (e instanceof TaskDomainError && e.code === 'INVALID_STATE_TRANSITION') {
          throw invalidState()
        }
        if (e instanceof TaskDomainError) {
          throw validationError(e.message)
        }
        throw e
      }

      const updated = await tasks.update(id, userId, {
        title: domain.title,
        description: domain.description,
        status: domain.status,
        dueDate: domain.dueDate,
      })
      if (!updated) throw notFound()
      return reply.send(mapTask(updated))
    } catch (err) {
      return sendApiError(reply, err)
    }
  })

  app.delete('/api/tasks/:id', async (request, reply) => {
    try {
      const userId = requireUserId(request)
      const { id } = request.params as { id: string }
      const deleted = await tasks.delete(id, userId)
      if (!deleted) throw notFound()
      return reply.code(204).send()
    } catch (err) {
      return sendApiError(reply, err)
    }
  })
}
