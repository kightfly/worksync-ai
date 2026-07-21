import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { App } from './App';

beforeEach(() => {
  localStorage.clear();
  window.history.pushState({}, '', '/');
  vi.restoreAllMocks();
});

describe('App', () => {
  it('未ログイン時はログイン画面を表示する', () => {
    vi.stubGlobal('fetch', vi.fn());
    render(<App />);
    expect(screen.getByRole('heading', { name: 'ログイン' })).toBeTruthy();
  });

  it('保護ページへ直接アクセスするとログインへ戻す', () => {
    window.history.pushState({}, '', '/tasks');
    vi.stubGlobal('fetch', vi.fn());
    render(<App />);
    expect(screen.getByRole('heading', { name: 'ログイン' })).toBeTruthy();
  });

  it('ログイン済みならタスク一覧を取得する', async () => {
    localStorage.setItem('ai-harness-token', 'token');
    localStorage.setItem(
      'ai-harness-user',
      JSON.stringify({ id: 'u1', email: 'test@example.com', name: 'テストユーザー' }),
    );

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ tasks: [] }),
      }),
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'タスク一覧' })).toBeTruthy();
    });
    expect(screen.getByText('タスクはありません')).toBeTruthy();
  });
});