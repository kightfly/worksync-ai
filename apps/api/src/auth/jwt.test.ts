import { describe, expect, it } from 'vitest'
import { hashPassword, verifyPassword } from './jwt.js'

describe('password hashing', () => {
  it('平文パスワードを保存せず bcrypt で検証できる', async () => {
    process.env.SALT_ROUNDS = '4'
    const hash = await hashPassword('password123')
    expect(hash).not.toContain('password123')
    expect(await verifyPassword('password123', hash)).toBe(true)
    expect(await verifyPassword('wrong', hash)).toBe(false)
  })
})
