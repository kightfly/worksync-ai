import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export type JwtPayload = {
  sub: string
  email: string
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is required')
  return secret
}

export function getSaltRounds(): number {
  return Number(process.env.SALT_ROUNDS ?? 10)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, getSaltRounds())
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: JwtPayload): string {
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? '8h') as jwt.SignOptions['expiresIn']
  return jwt.sign(payload, getJwtSecret(), { expiresIn })
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, getJwtSecret())
  if (typeof decoded !== 'object' || decoded === null || typeof decoded.sub !== 'string') {
    throw new Error('invalid token')
  }
  return {
    sub: decoded.sub,
    email: typeof decoded.email === 'string' ? decoded.email : '',
  }
}
