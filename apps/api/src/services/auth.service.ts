import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { UserRepository } from '@ai-harness/infrastructure';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error.js';
import { UnauthorizedError } from '../errors/unauthorized-error.js';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export interface LogoutResult {
  message: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtSecret: string,
  ) {}

  verifyToken(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, this.jwtSecret);
      if (
        typeof payload !== 'object' ||
        payload === null ||
        !('userId' in payload) ||
        !('email' in payload) ||
        typeof payload.userId !== 'string' ||
        typeof payload.email !== 'string'
      ) {
        throw new UnauthorizedError();
      }
      return {
        userId: payload.userId,
        email: payload.email,
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new UnauthorizedError();
    }
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email } satisfies JwtPayload,
      this.jwtSecret,
      { expiresIn: '24h' },
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  logout(token: string): LogoutResult {
    this.verifyToken(token);
    return { message: 'ログアウトしました' };
  }
}