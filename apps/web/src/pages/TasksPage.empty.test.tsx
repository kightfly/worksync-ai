import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TasksPage } from '../pages/TasksPage'

describe('TasksPage empty state', () => {
  it('タスクが無いとき空态文案を表示する', async () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })

    render(<TasksPage />)
    expect(await screen.findByText('タスクはありません')).toBeInTheDocument()

    globalThis.fetch = originalFetch
  })
})
