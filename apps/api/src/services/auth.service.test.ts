import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { AuthService } from './auth.service.js';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error.js';
import { UnauthorizedError } from '../errors/unauthorized-error.js';
import type { UserRepository } from '@ai-harness/infrastructure';

const JWT_SECRET = 'test-secret-key-for-unit-tests-32chars';

describe('AuthService', () => {
  it('有効な凭据で JWT とユーザーを返す', async () => {
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash('password123', 10);
    const userRepository = {
      findByEmail: vi.fn().mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        passwordHash: hash,
        name: 'テストユーザー',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    } as unknown as UserRepository;

    const service = new AuthService(userRepository, JWT_SECRET);
    const result = await service.login('test@example.com', 'password123');

    expect(result.user).toEqual({
      id: 'user-1',
      email: 'test@example.com',
      name: 'テストユーザー',
    });
    expect(result.token).toBeTruthy();
  });

  it('ユーザーが存在しない場合は InvalidCredentialsError', async () => {
    const userRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
    } as unknown as UserRepository;

    const service = new AuthService(userRepository, JWT_SECRET);
    await expect(service.login('missing@example.com', 'password123')).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it('パスワード不一致の場合は InvalidCredentialsError', async () => {
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash('password123', 10);
    const userRepository = {
      findByEmail: vi.fn().mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        passwordHash: hash,
        name: 'テストユーザー',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    } as unknown as UserRepository;

    const service = new AuthService(userRepository, JWT_SECRET);
    await expect(service.login('test@example.com', 'wrongpass')).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it('verifyToken で有効な JWT を検証する', () => {
    const userRepository = {} as UserRepository;
    const service = new AuthService(userRepository, JWT_SECRET);
    const token = jwt.sign({ userId: 'user-1', email: 'test@example.com' }, JWT_SECRET, {
      expiresIn: '1h',
    });

    expect(service.verifyToken(token)).toEqual({
      userId: 'user-1',
      email: 'test@example.com',
    });
  });

  it('無効な JWT は UnauthorizedError', () => {
    const userRepository = {} as UserRepository;
    const service = new AuthService(userRepository, JWT_SECRET);
    expect(() => service.verifyToken('invalid-token')).toThrow(UnauthorizedError);
  });

  it('logout は有効トークンで成功メッセージを返す', () => {
    const userRepository = {} as UserRepository;
    const service = new AuthService(userRepository, JWT_SECRET);
    const token = jwt.sign({ userId: 'user-1', email: 'test@example.com' }, JWT_SECRET, {
      expiresIn: '1h',
    });

    expect(service.logout(token)).toEqual({ message: 'ログアウトしました' });
  });
});