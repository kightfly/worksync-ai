const TOKEN_KEY = 'gienharness_token'

export function getApiBase(): string {
  // Empty = same-origin (Vite proxy in dev). Absolute URL still supported.
  const raw = import.meta.env.VITE_API_BASE_URL
  if (raw === undefined || raw === null) return ''
  return String(raw).replace(/\/$/, '')
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiClientError extends Error {
  readonly code: string
  readonly status: number

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  const token = options.token === undefined ? getStoredToken() : options.token
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (options.body !== undefined && options.body !== null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(`${getApiBase()}${path}`, { ...options, headers })
  if (res.status === 204 || res.status === 205) return undefined as T

  const text = await res.text()
  let body: unknown = {}
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = { error: { code: 'UNKNOWN', message: text.slice(0, 200) } }
    }
  }

  if (!res.ok) {
    const err = (body as { error?: { code?: string; message?: string } })?.error
    throw new ApiClientError(
      res.status,
      err?.code ?? 'UNKNOWN',
      err?.message ?? 'エラーが発生しました',
    )
  }
  return body as T
}
