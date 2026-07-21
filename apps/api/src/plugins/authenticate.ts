import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../errors/unauthorized-error.js';
import { extractBearerToken } from '../lib/auth-header.js';
import type { AuthService } from '../services/auth.service.js';

export function createAuthenticate(authService: AuthService) {
  return async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const token = extractBearerToken(request.headers.authorization);
    if (!token) {
      reply.status(401).send({
        error: 'UNAUTHORIZED',
        message: '認証が必要です',
      });
      return;
    }

    try {
      request.user = authService.verifyToken(token);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        reply.status(401).send({
          error: error.code,
          message: error.message,
        });
        return;
      }
      throw error;
    }
  };
}

export type AuthenticateHook = ReturnType<typeof createAuthenticate>;