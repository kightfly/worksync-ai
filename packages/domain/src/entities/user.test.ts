import { describe, it, expect } from 'vitest';
import { User } from './user.js';

describe('User.create', () => {
  it('有効なメールとパスワードでユーザーを作成する', () => {
    const user = User.create({
      email: '  Test@Example.COM  ',
      password: 'password123',
      name: 'テストユーザー',
    });
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('テストユーザー');
  });

  it('無効なメール形式は拒否する', () => {
    expect(() =>
      User.create({ email: 'invalid-email', password: 'password123' }),
    ).toThrow('メールアドレスの形式が正しくありません');
  });

  it('6文字未満のパスワードは拒否する', () => {
    expect(() =>
      User.create({ email: 'test@example.com', password: '12345' }),
    ).toThrow('パスワードは6文字以上で入力してください');
  });

  it('6文字のパスワードは許可する', () => {
    const user = User.create({
      email: 'test@example.com',
      password: '123456',
    });
    expect(user.email).toBe('test@example.com');
  });
});