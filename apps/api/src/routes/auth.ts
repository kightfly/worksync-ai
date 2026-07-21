import type { FastifyPluginAsync } from 'fastify';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error.js';
import { UnauthorizedError } from '../errors/unauthorized-error.js';
import { extractBearerToken } from '../lib/auth-header.js';
import { loginSchema } from '../schemas/auth.schema.js';
import type { AuthService } from '../services/auth.service.js';

export interface AuthRouteOptions {
  authService: AuthService;
}

const authRoutes: FastifyPluginAsync<AuthRouteOptions> = async (app, opts) => {
  app.post('/api/auth/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: 'VALIDATION_ERROR',
        message: parsed.error.errors[0]?.message ?? '入力内容が正しくありません',
      });
    }

    try {
      const result = await opts.authService.login(
        parsed.data.email,
        parsed.data.password,
      );
      return reply.send({
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(401).send({
          error: error.code,
          message: error.message,
        });
      }
      throw error;
    }
  });

  app.post('/api/auth/logout', async (request, reply) => {
    const token = extractBearerToken(request.headers.authorization);
    if (!token) {
      return reply.status(401).send({
        error: 'UNAUTHORIZED',
        message: '認証が必要です',
      });
    }

    try {
      const result = opts.authService.logout(token);
      return reply.send(result);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return reply.status(401).send({
          error: error.code,
          message: error.message,
        });
      }
      throw error;
    }
  });
};

export default authRoutes;