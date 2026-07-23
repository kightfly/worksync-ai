import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthContext'
import { ProtectedRoute } from '../auth/ProtectedRoute'

describe('ProtectedRoute', () => {
  it('未ログイン時は /login へリダイレクトする', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/tasks']}>
          <Routes>
            <Route path="/login" element={<div>ログイン画面</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/tasks" element={<div>タスク画面</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    )

    expect(screen.getByText('ログイン画面')).toBeInTheDocument()
  })
})
