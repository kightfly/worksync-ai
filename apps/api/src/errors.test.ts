import { describe, expect, it } from 'vitest'
import { ApiError, invalidState } from './errors.js'

describe('ApiError', () => {
  it('INVALID_STATE_TRANSITION の日文メッセージを返す', () => {
    const err = invalidState()
    expect(err.statusCode).toBe(400)
    expect(err.toBody()).toEqual({
      error: { code: 'INVALID_STATE_TRANSITION', message: '無効な状態遷移です' },
    })
  })

  it('ApiError は code を保持する', () => {
    const err = new ApiError(401, 'UNAUTHORIZED', '認証が必要です')
    expect(err.code).toBe('UNAUTHORIZED')
  })
})
