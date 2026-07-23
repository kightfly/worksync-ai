import { describe, expect, it } from 'vitest'
import { PING } from './index.js'

describe('domain package', () => {
  it('PING をエクスポートする', () => {
    expect(PING).toBe('gienharness-domain')
  })
})
