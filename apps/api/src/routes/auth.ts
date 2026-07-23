import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import type { UserRepository } from '@gienharness/infrastructure'
import { ApiError } from '../errors.js'
import { signToken, verifyPassword } from '../auth/jwt.js'
import { requireUserId, sendApiError } from '../auth/plugin.js'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const LOGIN_FAIL = 'メールアドレスまたはパスワードが正しくありません'

export function registerAuthRoutes(app: FastifyInstance, users: UserRepository) {
  app.post('/api/auth/login', async (request, reply) => {
    try {
      const parsed = loginSchema.safeParse(request.body)
      if (!parsed.success) {
        throw new ApiError(400, 'VALIDATION_ERROR', LOGIN_FAIL)
      }
      const { email, password } = parsed.data
      const user = await users.findByEmail(email)
      if (!user || !user.isActive) {
        throw new ApiError(401, 'UNAUTHORIZED', LOGIN_FAIL)
      }
      const ok = await verifyPassword(password, user.passwordHash)
      if (!ok) {
        throw new ApiError(401, 'UNAUTHORIZED', LOGIN_FAIL)
      }
      const token = signToken({ sub: user.id, email: user.email })
      return reply.send({
        token,
        user: { id: user.id, email: user.email, name: user.name },
      })
    } catch (err) {
      return sendApiError(reply, err)
    }
  })

  app.post('/api/auth/logout', async (request, reply) => {
    try {
      requireUserId(request)
      return reply.send({ ok: true })
    } catch (err) {
      return sendApiError(reply, err)
    }
  })
}
