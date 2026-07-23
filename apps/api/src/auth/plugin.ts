import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, unauthorized } from '../errors.js'
import { verifyToken } from './jwt.js'

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string
  }
}

export async function authPlugin(app: FastifyInstance) {
  app.decorateRequest('userId', undefined)

  app.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    const path = request.url.split('?')[0]
    if (path === '/health' || path === '/api/auth/login') {
      return
    }
    if (!path.startsWith('/api/')) {
      return
    }

    const header = request.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      const err = unauthorized()
      return reply.status(err.statusCode).send(err.toBody())
    }
    try {
      const payload = verifyToken(header.slice(7))
      request.userId = payload.sub
    } catch {
      const err = unauthorized()
      return reply.status(err.statusCode).send(err.toBody())
    }
  })
}

export function requireUserId(request: FastifyRequest): string {
  if (!request.userId) {
    throw unauthorized()
  }
  return request.userId
}

export function sendApiError(reply: FastifyReply, err: unknown) {
  if (err instanceof ApiError) {
    return reply.status(err.statusCode).send(err.toBody())
  }
  appErrorLog(err)
  return reply.status(500).send({
    error: { code: 'INTERNAL_ERROR', message: 'サーバーエラーが発生しました' },
  })
}

function appErrorLog(err: unknown) {
  console.error(err)
}
