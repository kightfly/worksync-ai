export type ApiErrorBody = {
  error: {
    code: string
    message: string
  }
}

export class ApiError extends Error {
  readonly statusCode: number
  readonly code: string

  constructor(statusCode: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
  }

  toBody(): ApiErrorBody {
    return { error: { code: this.code, message: this.message } }
  }
}

export function unauthorized(message = '認証が必要です'): ApiError {
  return new ApiError(401, 'UNAUTHORIZED', message)
}

export function notFound(message = '対象が見つかりません'): ApiError {
  return new ApiError(404, 'NOT_FOUND', message)
}

export function validationError(message: string): ApiError {
  return new ApiError(400, 'VALIDATION_ERROR', message)
}

export function invalidState(): ApiError {
  return new ApiError(400, 'INVALID_STATE_TRANSITION', '無効な状態遷移です')
}
